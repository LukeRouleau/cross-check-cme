<script lang="ts">
	import type { Database } from '$lib/database.types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Edit3 from '~icons/lucide/edit-3';
	import FileText from '~icons/lucide/file-text';
	import Clock from '~icons/lucide/clock';
	import Trash2 from '~icons/lucide/trash-2';
	import { toast } from 'svelte-sonner';
	import { createEventDispatcher } from 'svelte';

	type CaseRow = Database['public']['Tables']['cases']['Row'];
	type CaseStatusType = Database['public']['Enums']['case_status'];

	export let caseItem: CaseRow;

	const dispatch = createEventDispatcher<{
		deleted: { caseId: string };
	}>();

	const formatDate = (dateString: string | null | undefined) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const statusMessages: Record<CaseStatusType, string> = {
		draft: 'Draft - Needs completion',
		submitted: 'Submitted - Awaiting review',
		under_review: 'Under Review by Admin',
		in_progress: 'In Progress',
		declined: 'Declined by Admin',
		completed: 'Completed',
	};

	const isDraft = caseItem.status === 'draft';

	async function handleDelete() {
		const confirmed = window.confirm(
			'Are you sure you want to delete this draft case? This action cannot be undone.',
		);

		if (!confirmed) return;

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

			dispatch('deleted', { caseId: caseItem.id });

			window.location.reload();
		} catch (err) {
			console.error('Error deleting case:', err);
			toast.error(err instanceof Error ? err.message : 'Failed to delete case');
		}
	}
</script>

<Card.Root class="mb-4">
	<Card.Header class="flex flex-row items-center justify-between pb-2">
		<Card.Title class="text-lg font-semibold">
			Case ID: <span class="font-mono text-sm text-muted-foreground"
				>{caseItem.id.substring(0, 8)}...</span
			>
		</Card.Title>
		<div class="flex items-center space-x-2">
			<Button
				href={`/case/${caseItem.id}/initiate`}
				variant="outline"
				size="sm"
			>
				<Edit3 class="mr-2 h-4 w-4" />
				View / Edit
			</Button>
			{#if isDraft}
				<Button
					variant="destructive"
					size="sm"
					on:click={handleDelete}
					title="Delete this draft case"
				>
					<Trash2 class="h-4 w-4" />
				</Button>
			{/if}
		</div>
	</Card.Header>
	<Card.Content>
		<div class="text-sm text-muted-foreground">
			<p class="mb-1 flex items-center">
				<FileText class="mr-2 h-4 w-4 text-sky-600" />
				Status:
				<span class="ml-1 font-medium text-foreground"
					>{statusMessages[caseItem.status] || 'Unknown'}</span
				>
			</p>
			<p class="mb-1 flex items-center">
				<Clock class="mr-2 h-4 w-4 text-sky-600" />
				Created:
				<span class="ml-1 font-medium text-foreground"
					>{formatDate(caseItem.created_at)}</span
				>
			</p>
			{#if caseItem.updated_at}
				<p class="flex items-center">
					<Clock class="mr-2 h-4 w-4 text-sky-600" />
					Last Updated:
					<span class="ml-1 font-medium text-foreground"
						>{formatDate(caseItem.updated_at)}</span
					>
				</p>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
