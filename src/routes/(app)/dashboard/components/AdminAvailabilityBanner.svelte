<script lang="ts">
	import type { Database } from '$lib/database.types';
	import Info from '~icons/lucide/info';
	import ShieldAlert from '~icons/lucide/shield-alert';

	type AdminSettingsRow = Database['public']['Tables']['admin_settings']['Row'];
	export let adminSettings: AdminSettingsRow | null | undefined;
</script>

{#if adminSettings}
	<div
		class="mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm"
		class:border-yellow-300={!adminSettings.is_available}
		class:bg-yellow-50={!adminSettings.is_available}
		class:text-yellow-700={!adminSettings.is_available}
		class:border-blue-300={adminSettings.is_available}
		class:bg-blue-50={adminSettings.is_available}
		class:text-blue-700={adminSettings.is_available}
		role="alert"
	>
		{#if adminSettings.is_available}
			<Info class="h-5 w-5 flex-shrink-0" />
		{:else}
			<ShieldAlert class="h-5 w-5 flex-shrink-0" />
		{/if}
		<span class="font-medium">
			{#if adminSettings.is_available}
				Admin Availability: Currently Available
			{:else}
				Admin Availability: Currently Unavailable
			{/if}
		</span>
		{#if adminSettings.availability_message}
			<span class="ml-2 hidden md:inline">
				- {adminSettings.availability_message}</span
			>
		{/if}
	</div>
	{#if adminSettings.availability_message && !adminSettings.is_available}
		<p class="mb-6 text-sm text-yellow-700 md:hidden">
			{adminSettings.availability_message}
		</p>
	{/if}
{:else}
	<div
		class="mb-6 flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-700"
		role="status"
	>
		<Info class="h-5 w-5 flex-shrink-0" />
		<span class="font-medium">Loading admin availability...</span>
	</div>
{/if}
