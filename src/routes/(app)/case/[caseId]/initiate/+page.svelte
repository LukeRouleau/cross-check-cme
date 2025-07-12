<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import TermsStep from './components/TermsStep.svelte';
	import FileUploadStep from './components/FileUploadStep.svelte';
	import InstructionsStep from './components/InstructionsStep.svelte';
	import InitiationStepper from './components/InitiationStepper.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/database.types';
	import type { InitiationStep } from '$lib/types/initiation';
	import Trash2 from '~icons/lucide/trash-2';
	import ArrowLeft from '~icons/lucide/arrow-left';
	import ArrowRight from '~icons/lucide/arrow-right';
	import { onMount } from 'svelte';

	export let data: PageData;

	// Helper to safely convert string to InitiationStep
	function isValidInitiationStep(
		stepId: string | null | undefined,
	): stepId is InitiationStep {
		return ['terms', 'files', 'instructions', 'payment', 'review'].includes(
			stepId || '',
		);
	}

	function getSafeInitiationStep(
		stepId: string | null | undefined,
	): InitiationStep {
		if (isValidInitiationStep(stepId)) {
			return stepId;
		}
		return 'terms'; // Default step
	}

	interface StepConfig {
		id: InitiationStep;
		title: string;
		// component: any; // Could be used for dynamic component rendering if preferred
	}

	const steps: StepConfig[] = [
		{ id: 'terms', title: 'Terms of Service' },
		{ id: 'files', title: 'Upload Documents' },
		{ id: 'instructions', title: 'Provide Instructions' },
		{ id: 'payment', title: 'Make Deposit' },
		{ id: 'review', title: 'Review & Submit' },
	];

	let caseItem: Tables<'cases'> | undefined; // Will be initialized from data source
	let isSavingAgreement = false;
	let isDeleting = false;

	let currentStepId: InitiationStep = 'terms'; // Default, will be set by initializeStateFromDataSource
	let completedSteps: Set<InitiationStep> = new Set();
	let componentKey = 0;
	let initialized = false;

	// Function to set initial/reloaded state from a case data source
	function initializeStateFromDataSource(
		sourceCaseItem: Tables<'cases'> | undefined | null,
	) {
		if (sourceCaseItem) {
			caseItem = sourceCaseItem; // Update local caseItem to match the source
			currentStepId = getSafeInitiationStep(
				sourceCaseItem.case_initiation_step_id,
			);

			const newCompletedSteps = new Set<InitiationStep>();
			const loadedStepIndex = steps.findIndex((s) => s.id === currentStepId);
			for (let i = 0; i < loadedStepIndex; i++) {
				newCompletedSteps.add(steps[i].id);
			}
			if (sourceCaseItem.client_agreed_to_terms_id) {
				newCompletedSteps.add('terms');
			}
			// Note: 'files' and other steps will update completedSteps via their own events.
			completedSteps = newCompletedSteps;
		} else {
			caseItem = undefined;
			currentStepId = 'terms';
			completedSteps = new Set();
		}
	}

	onMount(() => {
		initializeStateFromDataSource(data.caseItem);
		initialized = true;
	});

	// Reactive sync: If data.caseItem from loader changes instance, re-initialize state.
	// This handles page reloads or SvelteKit invalidations that re-run the load function.
	let previousDataCaseItemInstance: Tables<'cases'> | undefined | null =
		data.caseItem;
	$: if (initialized && data.caseItem !== previousDataCaseItemInstance) {
		initializeStateFromDataSource(data.caseItem);
		previousDataCaseItemInstance = data.caseItem; // Update tracker for the instance
	}

	// Derive currentAgreedStatus reactively from local caseItem (which is updated from server responses)
	$: currentAgreedStatus = !!caseItem?.client_agreed_to_terms_id;

	// Live update for terms completion based on currentAgreedStatus (from local caseItem)
	$: if (initialized && caseItem) {
		// Check initialized and caseItem to run after onMount and if case exists
		if (currentAgreedStatus) {
			if (!completedSteps.has('terms')) {
				completedSteps.add('terms');
				completedSteps = new Set(completedSteps);
			}
		} else {
			if (completedSteps.has('terms')) {
				completedSteps.delete('terms');
				completedSteps = new Set(completedSteps);
			}
		}
	}

	// Live update for instructions completion based on custom_instructions
	$: if (initialized && caseItem) {
		const hasInstructions = !!(caseItem.custom_instructions?.trim());
		if (hasInstructions) {
			if (!completedSteps.has('instructions')) {
				completedSteps.add('instructions');
				completedSteps = new Set(completedSteps);
			}
		} else {
			if (completedSteps.has('instructions')) {
				completedSteps.delete('instructions');
				completedSteps = new Set(completedSteps);
			}
		}
	}

	$: isDraft = caseItem?.status === 'draft';
	$: currentStepIndex = steps.findIndex((s) => s.id === currentStepId);

	async function handleTermsAgreementChanged(
		event: CustomEvent<{ agreed: boolean; termsId: string }>,
	) {
		if (!caseItem) return;
		const { agreed, termsId } = event.detail; // `agreed` is true from TermsStep
		isSavingAgreement = true;
		try {
			const response = await fetch(`/api/cases/${caseItem.id}/agree-terms`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ termsId: termsId, agreed: agreed }),
			});
			if (!response.ok)
				throw new Error(
					(await response.json()).message || 'Failed to update terms',
				);

			const updatedCase = await response.json();
			caseItem = updatedCase; // This triggers reactive updates for currentAgreedStatus etc.

			// For the toast, use the value directly from the server response to avoid race conditions with reactive updates
			const serverConfirmedAgreement = !!updatedCase?.client_agreed_to_terms_id;

			// Toast based on the action and the server-confirmed status
			if (agreed && serverConfirmedAgreement) {
				toast.success('Terms of Service agreed.');
			} else if (agreed && !serverConfirmedAgreement) {
				toast.warning('Terms agreement could not be confirmed by the server.');
			}
			// No specific toast for retraction as TermsStep only sends agreed:true

			// Force re-render of keyed children as an additional measure if needed, but usually reactive updates suffice
			// componentKey += 1;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Update failed');
			// On error, caseItem is not updated. `currentAgreedStatus` remains as it was.
			// The TermsStep component's internal logic should handle reverting any optimistic UI.
		} finally {
			isSavingAgreement = false;
		}
	}

	function canProceed(): boolean {
		if (currentStepId === 'terms') return completedSteps.has('terms');
		if (currentStepId === 'files') return completedSteps.has('files');
		if (currentStepId === 'instructions') return completedSteps.has('instructions');
		// Add checks for other steps if needed
		return true; // Default for other steps for now
	}

	function navigateStep(direction: 'next' | 'previous' | InitiationStep) {
		const currentIndex = steps.findIndex((s) => s.id === currentStepId);
		const currentStoredStepId =
			data.caseItem?.case_initiation_step_id || 'terms';
		const currentStoredStepIndex = steps.findIndex(
			(s) => s.id === currentStoredStepId,
		);

		let newStepIdToPersist: InitiationStep | null = null;

		if (direction === 'next') {
			if (!canProceed()) {
				toast.warning('Please complete the current step before proceeding.');
				return;
			}
			completedSteps.add(currentStepId);
			if (currentIndex < steps.length - 1) {
				const nextStep = steps[currentIndex + 1].id;
				currentStepId = nextStep;
				// Only persist if advancing beyond the last known persisted step
				if (currentIndex + 1 > currentStoredStepIndex) {
					newStepIdToPersist = nextStep;
				}
			}
		} else if (direction === 'previous') {
			if (currentIndex > 0) {
				currentStepId = steps[currentIndex - 1].id;
				// Do not persist step when going backwards
			}
		} else {
			// Direct navigation from stepper
			const targetStepId = direction;
			const targetStepIndex = steps.findIndex((s) => s.id === targetStepId);
			const canNavigateDirectly =
				completedSteps.has(targetStepId) ||
				targetStepId === currentStepId ||
				targetStepIndex < currentIndex ||
				(completedSteps.has(currentStepId) &&
					targetStepIndex === currentIndex + 1);

			if (canNavigateDirectly) {
				currentStepId = targetStepId;
				// Only persist if advancing beyond the last known persisted step via direct nav
				if (
					targetStepIndex > currentStoredStepIndex &&
					completedSteps.has(targetStepId)
				) {
					// We should only persist if this direct nav actually means progress in the overall case.
					// This condition ensures we are moving to a completed step that is further than what's stored.
					// Or, more simply, if targetStepId is now the furthest *completed* step that isn't the final review step.
					// For simplicity now: if target is further than stored, and it's now current, persist it.
					// This might need refinement to ensure we only persist actual forward progression milestones.
					newStepIdToPersist = targetStepId;
				}
			} else {
				toast.warning('Cannot jump to an uncompleted future step.');
				return; // Prevent completedSteps update below if navigation failed
			}
		}

		if (newStepIdToPersist && newStepIdToPersist !== currentStoredStepId) {
			if (caseItem) {
				fetch(`/api/cases/${caseItem.id}/set-current-step`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ stepId: newStepIdToPersist }),
				})
					.then(async (response) => {
						if (response.ok) {
							const updatedCaseFromServer = await response.json();
							// Update local caseItem to keep data fresh, especially the case_initiation_step_id
							caseItem = updatedCaseFromServer;
							console.log('Case current step persisted:', newStepIdToPersist);
							// Optionally, show a subtle success toast or log
						} else {
							toast.error('Failed to save current step progress.');
							console.error('Failed to persist step', await response.text());
						}
					})
					.catch((err) => {
						toast.error('Error saving current step progress.');
						console.error('Error persisting step:', err);
					});
			}
		}
		completedSteps = new Set(completedSteps);
	}

	// Dedicated handler for the custom event from Stepper
	function handleNavigateToStepRequest(event: CustomEvent<InitiationStep>) {
		navigateStep(event.detail);
	}

	function handleStepStatusChange(
		event: CustomEvent<{ stepId: InitiationStep; isComplete: boolean }>,
	) {
		const { stepId, isComplete } = event.detail;
		const stepIndex = steps.findIndex((s) => s.id === stepId);

		if (isComplete) {
			if (!completedSteps.has(stepId)) {
				completedSteps.add(stepId);
			}
		} else {
			// Step became incomplete
			if (completedSteps.has(stepId)) {
				completedSteps.delete(stepId);
			}
			// Also remove all subsequent steps from completedSteps
			if (stepIndex !== -1) {
				// Ensure stepId was found
				for (let i = stepIndex + 1; i < steps.length; i++) {
					if (completedSteps.has(steps[i].id)) {
						completedSteps.delete(steps[i].id);
					}
				}
			}
		}
		completedSteps = new Set(completedSteps); // Force reactivity for Svelte
	}

	async function handleDeleteCase() {
		if (!caseItem) return;
		const confirmed = window.confirm(
			'Are you sure you want to delete this draft case?',
		);
		if (!confirmed) return;
		isDeleting = true;
		try {
			const response = await fetch(`/api/cases/${caseItem.id}`, {
				method: 'DELETE',
			});
			if (!response.ok)
				throw new Error(
					(await response.json().catch(() => ({}))).message ||
						'Failed to delete',
				);
			toast.success('Case deleted');
			goto('/dashboard');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Delete failed');
		} finally {
			isDeleting = false;
		}
	}

	function handleSubmitCase() {
		// Final submission logic here
		toast.info('Submitting case... (not yet implemented)');
		// This would typically change case status to 'submitted' via an API call
		// POST /api/cases/[caseId]/submit
	}

	$: nextButtonText =
		currentStepIndex === steps.length - 1
			? 'Review & Submit'
			: `Next: ${steps[currentStepIndex + 1]?.title || ''}`;
	$: isLastStep = currentStepIndex === steps.length - 1;
</script>

<svelte:head>
	<title
		>Initiate Case {caseItem?.id || ''} - {steps.find(
			(s) => s.id === currentStepId,
		)?.title}</title
	>
</svelte:head>

{#key componentKey}
	<div class="container mx-auto p-4">
		{#if caseItem}
			<h1 class="mb-4 text-2xl font-bold">Case Initiation: {caseItem.id}</h1>

			<InitiationStepper
				{steps}
				{currentStepId}
				{completedSteps}
				on:navigateToStepRequest={handleNavigateToStepRequest}
			/>

			<div class="mb-8 mt-8 min-h-[300px]">
				{#if currentStepId === 'terms'}
					<TermsStep
						agreedToTerms={currentAgreedStatus}
						on:termsAgreementChanged={handleTermsAgreementChanged}
					/>
				{:else if currentStepId === 'files'}
					<FileUploadStep
						caseId={caseItem.id}
						on:stepStatus={handleStepStatusChange}
					/>
				{:else if currentStepId === 'instructions'}
					<InstructionsStep
						caseId={caseItem.id}
						initialInstructions={caseItem.custom_instructions}
						on:stepStatus={handleStepStatusChange}
					/>
				{:else if currentStepId === 'payment'}
					<div
						class="rounded-md border bg-card p-6 text-card-foreground shadow-sm"
					>
						<h2 class="mb-3 text-xl font-semibold">Step 4: Make Deposit</h2>
						<p>Payment form will go here...</p>
						<!-- TODO: Implement PaymentStep.svelte -->
					</div>
				{:else if currentStepId === 'review'}
					<div
						class="rounded-md border bg-card p-6 text-card-foreground shadow-sm"
					>
						<h2 class="mb-3 text-xl font-semibold">Step 5: Review & Submit</h2>
						<p>Case summary and final submission button will go here...</p>
						<!-- TODO: Implement ReviewSubmitStep.svelte -->
					</div>
				{/if}
			</div>

			<!-- Bottom Navigation Buttons -->
			<div
				class="mt-8 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
			>
				<div class="w-full sm:w-auto">
					{#if isDraft}
						<Button
							variant="destructive"
							on:click={handleDeleteCase}
							disabled={isDeleting}
							class="w-full sm:w-auto"
						>
							{#if isDeleting}Deleting...{:else}<Trash2
									class="mr-2 inline h-4 w-4"
								/> Delete Draft{/if}
						</Button>
					{/if}
				</div>
				<div
					class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:space-x-3"
				>
					<Button
						variant="outline"
						on:click={() => navigateStep('previous')}
						disabled={currentStepIndex === 0}
						class="w-full sm:w-auto"
					>
						<ArrowLeft class="mr-2 inline h-4 w-4" /> Previous
					</Button>
					<Button
						on:click={() =>
							isLastStep ? handleSubmitCase() : navigateStep('next')}
						disabled={(currentStepId === 'terms' &&
							(!completedSteps.has('terms') || isSavingAgreement)) ||
							(currentStepId === 'files' && !completedSteps.has('files')) ||
							(currentStepId === 'instructions' && !completedSteps.has('instructions')) ||
							(isLastStep && !canProceed())}
						class="w-full sm:w-auto"
					>
						{#if currentStepId === 'terms' && isSavingAgreement}
							Saving...
						{:else if !isLastStep}
							<span>{nextButtonText}</span>
							<ArrowRight class="ml-2 inline h-4 w-4" />
						{:else}
							<span>{nextButtonText}</span>
						{/if}
					</Button>
				</div>
			</div>
		{:else}
			<p>Loading case details...</p>
			<p class="mt-4">
				<Button variant="outline" on:click={() => goto('/dashboard')}
					>Back to Dashboard</Button
				>
			</p>
		{/if}
	</div>
{/key}

<style>
	/* Add any specific styles if needed */
</style>
