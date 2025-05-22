<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { Tables } from '$lib/database.types.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { CircleCheck, CircleAlert } from 'lucide-svelte';

	// eslint-disable-next-line svelte/valid-compile
	export let caseId: string; // Will be used for API calls to update case agreement status
	export let agreedToTerms: boolean; // Prop from parent, this is the source of truth for checked state

	const dispatch = createEventDispatcher();

	let termsContent: Tables<'terms_of_service'> | null = null;
	let isLoading = true;
	let errorLoadingTerms: string | null = null;
	
	// Debug log to see prop changes
	$: console.log('[TermsStep] Prop agreedToTerms changed to:', agreedToTerms, '(isLoading:', isLoading, ')');

	onMount(async () => {
		console.log('[TermsStep] onMount started. Initial agreedToTerms prop:', agreedToTerms);
		isLoading = true;
		errorLoadingTerms = null;
		try {
			const response = await fetch('/api/terms/latest');
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to load Terms of Service');
			}
			termsContent = await response.json();
			console.log('[TermsStep] Successfully loaded termsContent:', termsContent?.version);
		} catch (err) {
			if (err instanceof Error) {
				errorLoadingTerms = err.message;
				toast.error('Could not load Terms of Service: ' + err.message);
			} else {
				errorLoadingTerms = 'An unknown error occurred';
				toast.error('Could not load Terms of Service: An unknown error occurred');
			}
		} finally {
			isLoading = false;
			console.log('[TermsStep] onMount finished. isLoading:', isLoading, 'termsContent loaded:', !!termsContent);
		}
	});

	function handleCheckboxClick() {
		if (isLoading || !termsContent) {
			console.log('[TermsStep] Checkbox click ignored (isLoading or !termsContent)');
			return;
		}
		
		// ONE-WAY AGREEMENT: Only allow checking (not unchecking)
		// If already agreed, do nothing
		if (agreedToTerms) {
			console.log('[TermsStep] Already agreed to terms, ignoring click');
			return;
		}
		
		// Only dispatch the event if we're agreeing (not disagreeing)
		dispatch('termsAgreementChanged', { agreed: true, termsId: termsContent.id });
	}
</script>

<div class="p-4 border rounded-md shadow-sm bg-card text-card-foreground">
	<h2 class="text-xl font-semibold mb-4">Step 1: Terms of Service</h2>

	{#if isLoading}
		<div class="flex items-center space-x-2">
			<svg
				class="animate-spin h-5 w-5 text-primary"
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
			class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 flex items-center"
			role="alert"
		>
			<CircleAlert class="w-5 h-5 mr-2" />
			<span class="font-medium">Error:</span>
			{errorLoadingTerms}
		</div>
	{:else if termsContent}
		<div
			class="prose prose-sm max-w-none p-4 border rounded-md mb-4 bg-muted/30 h-64 overflow-y-auto"
		>
			<h3 class="text-lg font-semibold">
				{termsContent.version} - Effective {new Date(
					termsContent.effective_date,
				).toLocaleDateString()}
			</h3>
			<p>{termsContent.content || 'No content available for these terms.'}</p>
		</div>
		<div class="flex items-center space-x-2 mb-4">
			<Checkbox
				id="terms-agree"
				checked={agreedToTerms}
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
				class="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800 flex items-center"
				role="alert"
			>
				<CircleCheck class="w-5 h-5 mr-2" />
				<span>You have agreed to the terms.</span>
			</div>
		{/if}
	{:else}
		<p>No Terms of Service are currently available.</p>
	{/if}
</div>
