<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import TermsStep from './components/TermsStep.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/database.types';
	import Trash2 from '~icons/lucide/trash-2'; // Import Trash icon

	export let data: PageData;

	let caseItem: Tables<'cases'>;
	let currentAgreedStatus = false;
	let isSavingAgreement = false;
	let isDeleting = false; // Track deletion state

	// Create a component-level flag to force UI update
	let componentKey = 0; // When this changes, it helps force re-rendering in some cases

	$: if (data.caseItem) {
		caseItem = data.caseItem;
		// Initialize agreement status from loaded case data
		currentAgreedStatus = !!caseItem.client_agreed_to_terms_id;
	}

	// Check if this is a draft case
	$: isDraft = caseItem?.status === 'draft';

	async function handleTermsAgreementChanged(
		event: CustomEvent<{ agreed: boolean; termsId: string }>,
	) {
		if (!caseItem) return;

		const { agreed, termsId } = event.detail;
		isSavingAgreement = true;

		try {
			const response = await fetch(`/api/cases/${caseItem.id}/agree-terms`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ termsId: termsId, agreed: agreed }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || 'Failed to update terms agreement',
				);
			}

			const updatedCase: Tables<'cases'> = await response.json();

			// Using a more explicit assignment to trigger reactivity
			const newAgreedStatus = !!updatedCase.client_agreed_to_terms_id;

			// Update local state AFTER we verify the API call succeeded
			caseItem = updatedCase;

			// Try a more aggressive approach to force reactivity
			setTimeout(() => {
				// Force state update in a new execution context
				currentAgreedStatus = newAgreedStatus;
				componentKey += 1; // Force children to re-render
			}, 0);

			toast.success(
				agreed ? 'Terms of Service agreed.' : 'Terms agreement retracted.',
			);
		} catch (err) {
			if (err instanceof Error) {
				toast.error('Error updating terms: ' + err.message);
			} else {
				toast.error('An unknown error occurred while updating terms.');
			}
			// Do not change currentAgreedStatus on error
		} finally {
			isSavingAgreement = false;
		}
	}

	function navigateToNextStep() {
		if (!caseItem) return;
		toast.info('Proceeding to next step (File Upload - not yet implemented)');
	}

	// Handle case deletion
	async function handleDeleteCase() {
		if (!caseItem) return;

		// Show confirmation dialog
		const confirmed = window.confirm(
			'Are you sure you want to delete this draft case? This action cannot be undone.',
		);

		if (!confirmed) return;

		isDeleting = true;

		try {
			const response = await fetch(`/api/cases/${caseItem.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message || `Failed to delete case: ${response.statusText}`,
				);
			}

			toast.success('Case deleted successfully');
			// Navigate back to dashboard after successful deletion
			goto('/dashboard');
		} catch (err) {
			console.error('Error deleting case:', err);
			toast.error(err instanceof Error ? err.message : 'Failed to delete case');
			isDeleting = false;
		}
	}
</script>

<svelte:head>
	<title>Initiate Case {caseItem?.id || ''}</title>
</svelte:head>

<!-- Use a keyed {#key} block instead of an attribute for component re-rendering -->
{#key componentKey}
	<div class="container mx-auto p-4">
		{#if caseItem}
			<h1 class="mb-6 text-2xl font-bold">Case Initiation: {caseItem.id}</h1>

			<div class="space-y-8">
				<TermsStep
					caseId={caseItem.id}
					agreedToTerms={currentAgreedStatus}
					on:termsAgreementChanged={handleTermsAgreementChanged}
				/>

				<div
					class="rounded-md border bg-card p-4 text-card-foreground opacity-50 shadow-sm"
				>
					<h2 class="mb-2 text-xl font-semibold">Step 2: Upload Documents</h2>
					<p class="text-muted-foreground">This step is not yet active.</p>
				</div>

				<div
					class="rounded-md border bg-card p-4 text-card-foreground opacity-50 shadow-sm"
				>
					<h2 class="mb-2 text-xl font-semibold">
						Step 3: Provide Instructions
					</h2>
					<p class="text-muted-foreground">This step is not yet active.</p>
				</div>

				<div
					class="rounded-md border bg-card p-4 text-card-foreground opacity-50 shadow-sm"
				>
					<h2 class="mb-2 text-xl font-semibold">Step 4: Make Deposit</h2>
					<p class="text-muted-foreground">This step is not yet active.</p>
				</div>

				<div
					class="rounded-md border bg-card p-4 text-card-foreground opacity-50 shadow-sm"
				>
					<h2 class="mb-2 text-xl font-semibold">Step 5: Review and Submit</h2>
					<p class="text-muted-foreground">This step is not yet active.</p>
				</div>
			</div>

			<div class="mt-8 flex justify-end space-x-3">
				<Button variant="outline" on:click={() => goto('/dashboard')}
					>Back to Dashboard</Button
				>
				{#if isDraft}
					<Button
						variant="destructive"
						on:click={handleDeleteCase}
						disabled={isDeleting}
					>
						{#if isDeleting}
							Deleting...
						{:else}
							<Trash2 class="mr-2 h-4 w-4" />
							Delete Case
						{/if}
					</Button>
				{/if}
				<Button
					on:click={navigateToNextStep}
					disabled={!currentAgreedStatus || isSavingAgreement}
				>
					{#if isSavingAgreement}Saving...{:else}Save & Continue{/if}
				</Button>
			</div>
		{:else}
			<p>Loading case details...</p>
		{/if}
	</div>
{/key}

<style>
	/* Add any specific styles if needed */
</style>
