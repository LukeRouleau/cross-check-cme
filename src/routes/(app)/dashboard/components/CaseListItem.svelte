<script lang="ts">
	import type { Database } from '$lib/database.types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Edit3 from '~icons/lucide/edit-3';
	import FileText from '~icons/lucide/file-text';
	import Clock from '~icons/lucide/clock';

	type CaseRow = Database['public']['Tables']['cases']['Row'];
	type CaseStatusType = Database['public']['Enums']['case_status'];

	export let caseItem: CaseRow;

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
</script>

<Card.Root class="mb-4">
	<Card.Header class="flex flex-row items-center justify-between pb-2">
		<Card.Title class="text-lg font-semibold">
			Case ID: <span class="font-mono text-sm text-muted-foreground"
				>{caseItem.id.substring(0, 8)}...</span
			>
		</Card.Title>
		<Button href={`/case/${caseItem.id}/initiate`} variant="outline" size="sm">
			<Edit3 class="mr-2 h-4 w-4" />
			View / Edit
		</Button>
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
