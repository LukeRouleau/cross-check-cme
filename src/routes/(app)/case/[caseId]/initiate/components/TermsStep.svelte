<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { Tables } from '$lib/database.types.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { CircleCheck, CircleAlert } from 'lucide-svelte';

	export let agreedToTerms: boolean; // Prop from parent, this is the source of truth for checked state

	const dispatch = createEventDispatcher();

	let termsContent: Tables<'terms_of_service'> | null = null;
	let isLoading = true;
	let errorLoadingTerms: string | null = null;

	let localChecked: boolean;
	let internalClick = false; // Flag to manage internal clicks

	// When prop changes, update localChecked.
	// If it was an internal click that caused this, reset the flag only AFTER localChecked matches agreedToTerms.
	$: {
		if (internalClick) {
			// We made an optimistic update and are waiting for the prop to confirm.
			if (localChecked === agreedToTerms) {
				// Prop confirmed the optimistic update (e.g. localChecked=true, agreedToTerms became true).
				internalClick = false;
			} else {
				// Prop contradicts the optimistic update.
				localChecked = agreedToTerms; // This will revert the optimistic UI change
				internalClick = false;
			}
		} else {
			if (localChecked !== agreedToTerms) {
				localChecked = agreedToTerms;
			}
		}
	}

	// Debug log to see prop changes
	$: console.log(
		'[TermsStep] Prop agreedToTerms changed to:',
		agreedToTerms,
		'localChecked is now:',
		localChecked,
	);

	onMount(async () => {
		console.log(
			'[TermsStep] onMount started. Initial agreedToTerms prop:',
			agreedToTerms,
		);
		localChecked = agreedToTerms; // Initial sync
		isLoading = true;
		errorLoadingTerms = null;
		try {
			const response = await fetch('/api/terms/latest');
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to load Terms of Service');
			}
			termsContent = await response.json();
			console.log(
				'[TermsStep] Successfully loaded termsContent:',
				termsContent?.version,
			);
		} catch (err) {
			if (err instanceof Error) {
				errorLoadingTerms = err.message;
				toast.error('Could not load Terms of Service: ' + err.message);
			} else {
				errorLoadingTerms = 'An unknown error occurred';
				toast.error(
					'Could not load Terms of Service: An unknown error occurred',
				);
			}
		} finally {
			isLoading = false;
			console.log(
				'[TermsStep] onMount finished. isLoading:',
				isLoading,
				'termsContent loaded:',
				!!termsContent,
			);
		}
	});

	function handleCheckboxClick() {
		if (isLoading || !termsContent) return;

		if (agreedToTerms) {
			// Check against the prop for the source of truth of agreement
			toast.info(
				'Terms are already agreed. Agreement cannot be retracted here.',
			);
			if (!localChecked) localChecked = true; // Ensure UI consistency if somehow out of sync
			return;
		}

		// If not yet agreed (prop: agreedToTerms is false), this click is an attempt to agree.
		internalClick = true;
		localChecked = true; // Optimistically update UI

		dispatch('termsAgreementChanged', {
			agreed: true,
			termsId: termsContent.id,
		});
	}
</script>

<div class="rounded-md border bg-card p-4 text-card-foreground shadow-sm">
	<h2 class="mb-4 text-xl font-semibold">Step 1: Terms of Service</h2>

	{#if isLoading}
		<div class="flex items-center space-x-2">
			<svg
				class="h-5 w-5 animate-spin text-primary"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<span>Loading Terms of Service...</span>
		</div>
	{:else if errorLoadingTerms}
		<div
			class="mb-4 flex items-center rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
			role="alert"
		>
			<CircleAlert class="mr-2 h-5 w-5" />
			<span class="font-medium">Error:</span>
			{errorLoadingTerms}
		</div>
	{:else if termsContent}
		<div
			class="prose prose-sm mb-4 h-64 max-w-none overflow-y-auto rounded-md border bg-muted/30 p-4"
		>
			<h3 class="text-lg font-semibold">
				{termsContent.version} - Effective {new Date(
					termsContent.effective_date,
				).toLocaleDateString()}
			</h3>
			<p>{termsContent.content || 'No content available for these terms.'}</p>
		</div>
		<div class="mb-4 flex items-center space-x-2">
			<Checkbox
				id="terms-agree"
				bind:checked={localChecked}
				disabled={!termsContent || isLoading || agreedToTerms}
				on:click={handleCheckboxClick}
			/>
			<Label
				for="terms-agree"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				I have read and agree to the Terms of Service ({termsContent.version}).
			</Label>
		</div>

		{#if agreedToTerms}
			<div
				class="flex items-center rounded-lg bg-green-100 p-3 text-sm text-green-700 dark:bg-green-200 dark:text-green-800"
				role="alert"
			>
				<CircleCheck class="mr-2 h-5 w-5" />
				<span>You have agreed to the terms.</span>
			</div>
		{/if}
	{:else}
		<p>No Terms of Service are currently available.</p>
	{/if}
</div>
