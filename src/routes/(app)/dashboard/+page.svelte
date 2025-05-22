<script lang="ts">
	import type { PageData } from './$types';
	import type { Database } from '$lib/database.types';
	import AdminAvailabilityBanner from './components/AdminAvailabilityBanner.svelte';
	import CaseListItem from './components/CaseListItem.svelte';
	import { Button } from '$lib/components/ui/button';
	import PlusCircle from '~icons/lucide/plus-circle';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	type CaseRow = Database['public']['Tables']['cases']['Row'];
	type CaseStatusType = Database['public']['Enums']['case_status'];

	export let data: PageData;

	let userCases: CaseRow[] = data.userCases || [];
	let adminSettings: PageData['adminSettings'] =
		data.adminSettings === undefined ? null : data.adminSettings;

	$: {
		if (data.userCases !== undefined) {
			userCases = data.userCases;
		}
		if (data && typeof data === 'object' && 'adminSettings' in data) {
			adminSettings = data.adminSettings;
		} else if (data.adminSettings === undefined) {
			adminSettings = null;
		}
	}

	const createNewCase = async () => {
		const response = await fetch('/api/cases', {
			method: 'POST',
		});

		if (response.ok) {
			const newCase: CaseRow = await response.json();
			toast.success('New case created successfully!');
			goto(`/case/${newCase.id}/initiate`);
		} else {
			let errorMessage = 'Failed to create new case. Please try again.';
			try {
				// Try to parse as JSON, but don't fail if it's not
				const errorData = await response.json();
				if (errorData && errorData.message) {
					errorMessage = errorData.message;
				}
			} catch (e) {
				// Response was not JSON, use the default message or status text
				if (response.statusText) {
					errorMessage = `Failed to create new case: ${response.statusText}`;
				}
				console.error('Error response was not JSON:', e);
			}
			toast.error(errorMessage);
		}
	};

	const filterCases = (statuses: CaseStatusType[]) => {
		return userCases.filter((c) => statuses.includes(c.status));
	};

	$: openCases = filterCases(['draft']);
	$: inProgressCases = filterCases([
		'submitted',
		'under_review',
		'in_progress',
	]);
	$: pastCases = filterCases(['completed', 'declined']);

	// Handle case deletion from the list
	function handleCaseDeleted(event: CustomEvent<{ caseId: string }>) {
		const deletedCaseId = event.detail.caseId;
		// Update local userCases array
		userCases = userCases.filter((c) => c.id !== deletedCaseId);
		// The reactive declarations will automatically update the filtered lists
	}
</script>

<div class="container mx-auto p-4 md:p-6">
	<AdminAvailabilityBanner adminSettings={data.adminSettings} />

	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold tracking-tight">Your Cases</h1>
		<Button
			on:click={createNewCase}
			size="lg"
			disabled={!data.adminSettings?.is_available}
		>
			<PlusCircle class="mr-2 h-5 w-5" />
			Create New Case
		</Button>
	</div>

	{#if adminSettings && !adminSettings.is_available}
		<p
			class="mb-6 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-center text-sm text-yellow-700"
		>
			New case creation is temporarily disabled as the admin is currently
			unavailable.
			{#if adminSettings.availability_message}
				{adminSettings.availability_message}{/if}
		</p>
	{/if}

	<!-- Open Cases -->
	<section class="mb-10">
		<h2 class="mb-4 border-b pb-2 text-2xl font-semibold tracking-tight">
			Open Cases <span class="text-sm text-muted-foreground"
				>({openCases.length})</span
			>
		</h2>
		{#if openCases.length > 0}
			{#each openCases as caseItem (caseItem.id)}
				<CaseListItem {caseItem} on:deleted={handleCaseDeleted} />
			{/each}
		{:else}
			<p class="text-muted-foreground">
				You have no open cases that require completion. Click "Create New Case"
				to start one.
			</p>
		{/if}
	</section>

	<Separator class="my-8" />

	<!-- In Progress Cases -->
	<section class="mb-10">
		<h2 class="mb-4 border-b pb-2 text-2xl font-semibold tracking-tight">
			In Progress <span class="text-sm text-muted-foreground"
				>({inProgressCases.length})</span
			>
		</h2>
		{#if inProgressCases.length > 0}
			{#each inProgressCases as caseItem (caseItem.id)}
				<CaseListItem {caseItem} on:deleted={handleCaseDeleted} />
			{/each}
		{:else}
			<p class="text-muted-foreground">
				You have no cases currently in progress with the admin.
			</p>
		{/if}
	</section>

	<Separator class="my-8" />

	<!-- Past Cases -->
	<section>
		<h2 class="mb-4 border-b pb-2 text-2xl font-semibold tracking-tight">
			Case History <span class="text-sm text-muted-foreground"
				>({pastCases.length})</span
			>
		</h2>
		{#if pastCases.length > 0}
			{#each pastCases as caseItem (caseItem.id)}
				<CaseListItem {caseItem} on:deleted={handleCaseDeleted} />
			{/each}
		{:else}
			<p class="text-muted-foreground">
				You have no past completed or declined cases.
			</p>
		{/if}
	</section>
</div>
