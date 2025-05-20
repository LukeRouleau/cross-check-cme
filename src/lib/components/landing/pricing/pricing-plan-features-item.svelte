<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { cn } from '$lib/utils';
	import LucideCheck from '~icons/lucide/check';

	export let icon: ComponentType = LucideCheck;
	export let iconClass: string = 'h-4 w-4 text-primary'; // Default class for the icon
</script>

<li class={cn('flex flex-col divide-muted pt-2', $$props.class)}>
	<div class="flex items-center gap-2">
		<svelte:component
			this={icon}
			class={cn(iconClass, 'h-4 w-4', 'shrink-0')}
		/>
		<slot />
	</div>
</li>
