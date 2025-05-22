<script lang="ts">
	import type { InitiationStep } from '$lib/types/initiation'; // Import from new location

	export let steps: Array<{ id: InitiationStep; title: string }> = [];
	export let currentStepId: InitiationStep;
	export let completedSteps: Set<InitiationStep>;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleClick(stepId: InitiationStep) {
		const targetStepIndex = steps.findIndex((s) => s.id === stepId);
		const currentStepIndex = steps.findIndex((s) => s.id === currentStepId);

		if (
			stepId === currentStepId || // Current step
			completedSteps.has(stepId) || // Any completed step
			targetStepIndex < currentStepIndex || // Any previous step
			(completedSteps.has(currentStepId) &&
				targetStepIndex === currentStepIndex + 1) // Next step if current is complete
		) {
			dispatch('navigateToStepRequest', stepId);
		} else {
			console.log('Cannot navigate to a future, uncompleted step directly.');
		}
	}
</script>

<nav aria-label="Case Initiation Steps" class="mb-6">
	<ol class="flex items-center space-x-2 text-sm font-medium text-gray-500">
		{#each steps as step, i (step.id)}
			{@const currentStepIndexValue = steps.findIndex(
				(s) => s.id === currentStepId,
			)}
			<!-- To avoid recomputing in class directives -->
			<li>
				<button
					on:click={() => handleClick(step.id)}
					class="focus:ring-primary-focus flex items-center rounded-md p-1 transition-colors duration-150 focus:outline-none focus:ring-2"
					class:text-primary={currentStepId === step.id}
					class:hover:text-primary-hover={currentStepId !== step.id &&
						(completedSteps.has(step.id) ||
							i < currentStepIndexValue ||
							(completedSteps.has(currentStepId) &&
								i === currentStepIndexValue + 1))}
					class:cursor-not-allowed={currentStepId !== step.id &&
						!(
							completedSteps.has(step.id) ||
							i < currentStepIndexValue ||
							(completedSteps.has(currentStepId) &&
								i === currentStepIndexValue + 1)
						)}
					class:opacity-60={currentStepId !== step.id &&
						!(
							completedSteps.has(step.id) ||
							i < currentStepIndexValue ||
							(completedSteps.has(currentStepId) &&
								i === currentStepIndexValue + 1)
						)}
					disabled={currentStepId === step.id
						? false
						: !(
								completedSteps.has(step.id) ||
								i < currentStepIndexValue ||
								(completedSteps.has(currentStepId) &&
									i === currentStepIndexValue + 1)
							)}
					aria-current={currentStepId === step.id ? 'step' : undefined}
				>
					{#if completedSteps.has(step.id)}
						<svg
							class="mr-1.5 h-4 w-4"
							class:text-green-500={currentStepId !== step.id}
							class:text-primary={currentStepId === step.id}
							fill="currentColor"
							viewBox="0 0 20 20"
							><path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path></svg
						>
					{:else if currentStepId === step.id}
						<svg
							class="mr-1.5 h-4 w-4 animate-pulse text-primary"
							fill="currentColor"
							viewBox="0 0 20 20"
							><path
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
							></path></svg
						>
					{:else}
						<span
							class="mr-1.5 flex h-4 w-4 items-center justify-center rounded-full border {i >
								steps.findIndex((s) => s.id === currentStepId) &&
							!completedSteps.has(step.id)
								? 'border-gray-300'
								: 'border-gray-400'}"
						>
							{i + 1}
						</span>
					{/if}
					{step.title}
				</button>
			</li>
			{#if i < steps.length - 1}
				<li class="text-gray-400">
					<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						></path></svg
					>
				</li>
			{/if}
		{/each}
	</ol>
</nav>

<style>
	/* Tailwind CSS classes are used primarily. 
	   Add any additional specific styles here if needed for fine-tuning. 
	   For example, to ensure the primary color for hover is Tailwind compatible if not default:
	   .hover\:text-primary-hover:hover {
		   color: hsl(var(--primary-hover)); 
	   }
	*/
</style>
