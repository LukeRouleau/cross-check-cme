<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { Tables } from '$lib/database.types.js';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { CircleCheck, CircleAlert, Save } from 'lucide-svelte';

	export let caseId: string;
	export let initialInstructions: string | null = null;

	const dispatch = createEventDispatcher();

	let instructions = '';
	let isSaving = false;
	let hasUnsavedChanges = false;
	let lastSavedInstructions = '';
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	// Character limits
	const MAX_CHARACTERS = 5000;
	const WARN_THRESHOLD = 4500;

	$: characterCount = instructions.length;
	$: charactersRemaining = MAX_CHARACTERS - characterCount;
	$: isNearLimit = characterCount >= WARN_THRESHOLD;
	$: isAtLimit = characterCount >= MAX_CHARACTERS;
	$: isValidInstructions = instructions.trim().length > 0 && characterCount <= MAX_CHARACTERS;

	// Track completion status
	$: {
		const isComplete = isValidInstructions && !hasUnsavedChanges;
		dispatch('stepStatus', {
			stepId: 'instructions',
			isComplete: isComplete
		});
	}

	onMount(() => {
		// Initialize with existing instructions
		if (initialInstructions) {
			instructions = initialInstructions;
			lastSavedInstructions = initialInstructions;
		}
		console.log('[InstructionsStep] Initialized with instructions:', !!initialInstructions);
	});

	// Auto-save functionality
	function scheduleAutoSave() {
		if (saveTimer) {
			clearTimeout(saveTimer);
		}
		
		// Only auto-save if instructions are valid and different from last saved
		if (isValidInstructions && instructions.trim() !== lastSavedInstructions.trim()) {
			saveTimer = setTimeout(() => {
				saveInstructions(true); // true indicates auto-save
			}, 2000); // Auto-save after 2 seconds of inactivity
		}
	}

	// Handle input changes
	function handleInput() {
		hasUnsavedChanges = instructions.trim() !== lastSavedInstructions.trim();
		scheduleAutoSave();
	}

	// Save instructions to the server
	async function saveInstructions(isAutoSave = false) {
		if (!isValidInstructions) {
			if (!isAutoSave) {
				toast.error('Please provide valid instructions before saving.');
			}
			return;
		}

		if (instructions.trim() === lastSavedInstructions.trim()) {
			if (!isAutoSave) {
				toast.info('No changes to save.');
			}
			return;
		}

		isSaving = true;
		
		try {
			const response = await fetch(`/api/cases/${caseId}/instructions`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ instructions: instructions.trim() })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to save instructions');
			}

			const updatedCase: Tables<'cases'> = await response.json();
			lastSavedInstructions = updatedCase.custom_instructions || '';
			hasUnsavedChanges = false;

			if (isAutoSave) {
				console.log('[InstructionsStep] Auto-saved instructions');
			} else {
				toast.success('Instructions saved successfully.');
			}

		} catch (err) {
			console.error('[InstructionsStep] Error saving instructions:', err);
			if (!isAutoSave) {
				toast.error(err instanceof Error ? err.message : 'Failed to save instructions');
			}
		} finally {
			isSaving = false;
		}
	}

	// Handle manual save button click
	function handleSaveClick() {
		saveInstructions(false);
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Ctrl+S or Cmd+S to save
		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			handleSaveClick();
		}
	}

	// Clear auto-save timer on component destroy
	onMount(() => {
		return () => {
			if (saveTimer) {
				clearTimeout(saveTimer);
			}
		};
	});
</script>

<div class="rounded-md border bg-card p-4 text-card-foreground shadow-sm">
	<h2 class="mb-4 text-xl font-semibold">Step 3: Provide Instructions</h2>
	
	<div class="space-y-4">
		<div>
			<Label for="instructions-textarea" class="text-sm font-medium">
				Custom Instructions for Your Case Review
			</Label>
			<p class="mt-1 text-sm text-muted-foreground">
				Please provide specific instructions or details you'd like our consultant to focus on during the review of your case.
				This could include particular concerns, questions, or areas of emphasis.
			</p>
		</div>

		<div class="space-y-2">
			<Textarea
				id="instructions-textarea"
				bind:value={instructions}
				on:input={handleInput}
				on:keydown={handleKeydown}
				placeholder="Enter your specific instructions here..."
				class="min-h-[200px] resize-none"
				disabled={isSaving}
				maxlength={MAX_CHARACTERS}
			/>
			
			<!-- Character count and status -->
			<div class="flex items-center justify-between text-sm">
				<div class="flex items-center space-x-2">
					{#if hasUnsavedChanges}
						<span class="text-amber-600">
							<CircleAlert class="inline h-4 w-4" />
							Unsaved changes
						</span>
					{:else if isValidInstructions}
						<span class="text-green-600">
							<CircleCheck class="inline h-4 w-4" />
							Saved
						</span>
					{/if}
				</div>
				
				<div class="text-right">
					<span class={isNearLimit ? (isAtLimit ? 'text-red-600' : 'text-amber-600') : 'text-muted-foreground'}>
						{characterCount}/{MAX_CHARACTERS}
					</span>
					{#if isNearLimit}
						<div class="text-xs {isAtLimit ? 'text-red-600' : 'text-amber-600'}">
							{isAtLimit ? 'Character limit reached' : `${charactersRemaining} characters remaining`}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Manual save button -->
		<div class="flex justify-start">
			<Button
				on:click={handleSaveClick}
				disabled={isSaving || !hasUnsavedChanges || !isValidInstructions}
				variant="outline"
				size="sm"
			>
				{#if isSaving}
					<span class="animate-spin mr-2">⏳</span>
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save Instructions
				{/if}
			</Button>
		</div>

		<!-- Validation messages -->
		{#if instructions.trim().length === 0}
			<div class="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
				<CircleAlert class="inline mr-2 h-4 w-4" />
				Please provide instructions to continue to the next step.
			</div>
		{:else if isValidInstructions && !hasUnsavedChanges}
			<div class="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
				<CircleCheck class="inline mr-2 h-4 w-4" />
				Instructions saved successfully. You can proceed to the next step.
			</div>
		{/if}

		<!-- Help text -->
		<div class="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
			<h4 class="font-medium mb-1">Tips for effective instructions:</h4>
			<ul class="text-xs space-y-1 ml-4">
				<li>• Be specific about your concerns or questions</li>
				<li>• Mention any particular areas you want emphasized</li>
				<li>• Include relevant medical history or context</li>
				<li>• Note any deadlines or urgency factors</li>
			</ul>
			<p class="text-xs mt-2 text-muted-foreground">
				💡 Use Ctrl+S (or Cmd+S) to save manually. Changes auto-save after 2 seconds of inactivity.
			</p>
		</div>
	</div>
</div>