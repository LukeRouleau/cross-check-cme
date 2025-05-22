<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card';
	import { Trash2, UploadCloud, FileText } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let caseId: string;

	// --- Configuration ---
	const MAX_FILE_SIZE_MB = 20;
	const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
	const ALLOWED_MIME_TYPES = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'image/jpeg',
		'image/png',
	];
	const ACCEPTED_FILE_EXTENSIONS = '.pdf, .doc, .docx, .jpg, .jpeg, .png';
	// --- End Configuration ---

	interface CaseDocument {
		id: string;
		file_name: string;
		mime_type: string; // Changed from file_type to match DB & API response
		file_size_bytes: number; // Changed from file_size to match DB & API response
		uploaded_at: string;
		// storage_path: string; // May not be needed on client
	}

	let selectedFiles: File[] = [];
	let uploadedDocuments: CaseDocument[] = [];
	let isLoadingExisting = false;
	let isUploading = false;
	let dragOver = false;

	const dispatch = createEventDispatcher();

	onMount(() => {
		caseId = $page.params.caseId;
		fetchUploadedDocuments();
	});

	$: dispatchStepStatus(uploadedDocuments);

	function dispatchStepStatus(documents: CaseDocument[]) {
		if (caseId) {
			dispatch('stepStatus', {
				stepId: 'files',
				isComplete: documents.length > 0,
			});
		}
	}

	async function fetchUploadedDocuments() {
		if (!caseId) return;
		isLoadingExisting = true;
		try {
			const response = await fetch(`/api/cases/${caseId}/documents`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to fetch documents');
			}
			uploadedDocuments = await response.json();
		} catch (error) {
			console.error('Error fetching documents:', error);
			toast.error(
				error instanceof Error
					? error.message
					: 'Could not load existing documents.',
			);
		} finally {
			isLoadingExisting = false;
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			addFilesToList(Array.from(target.files));
		}
		// Reset file input to allow selecting the same file again if removed
		target.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		if (event.dataTransfer?.files) {
			addFilesToList(Array.from(event.dataTransfer.files));
		}
	}

	function triggerFileInputClick() {
		document.getElementById('fileInput')?.click();
	}

	function handleDragDropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			triggerFileInputClick();
		}
	}

	function addFilesToList(files: File[]) {
		if (isUploading) {
			toast.info(
				'Please wait for the current upload to complete before adding more files.',
			);
			return;
		}
		const newFiles: File[] = [];
		for (const file of files) {
			if (!ALLOWED_MIME_TYPES.includes(file.type)) {
				toast.error(
					`Invalid file type: ${file.name} (${file.type}). Allowed: ${ACCEPTED_FILE_EXTENSIONS}`,
				);
				continue;
			}
			if (file.size > MAX_FILE_SIZE_BYTES) {
				toast.error(
					`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Max: ${MAX_FILE_SIZE_MB} MB.`,
				);
				continue;
			}
			if (
				!selectedFiles.find((f) => f.name === file.name) &&
				!uploadedDocuments.find((d) => d.file_name === file.name)
			) {
				newFiles.push(file);
			} else {
				toast.warning(`File already selected or uploaded: ${file.name}`);
			}
		}
		if (newFiles.length > 0) {
			selectedFiles = newFiles; // Only process these new files for the immediate upload
			uploadSelectedFiles();
		}
	}

	async function uploadSelectedFiles() {
		if (selectedFiles.length === 0) {
			return;
		}
		isUploading = true;
		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append('files', file, file.name);
		});

		try {
			const response = await fetch(`/api/cases/${caseId}/documents`, {
				method: 'POST',
				body: formData,
				// Headers are automatically set to multipart/form-data by browser
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'File upload failed');
			}

			// const newDocs = await response.json(); // Assuming server returns newly created document records
			// toast.success(`${selectedFiles.length} file(s) uploaded successfully!`);
			// Consider updating the toast: toast.success('Files uploaded!', { id: 'upload-toast' })
			selectedFiles = [];
			await fetchUploadedDocuments(); // This will refresh and trigger reactive dispatch
		} catch (error) {
			console.error('Error uploading files:', error);
			// Consider updating the toast: toast.error('Upload failed.', { id: 'upload-toast' })
			toast.error(
				error instanceof Error
					? error.message
					: 'An unexpected error occurred during upload.',
			);
		} finally {
			isUploading = false;
		}
	}

	async function deleteDocument(documentId: string, documentName: string) {
		if (
			!confirm(
				`Are you sure you want to delete ${documentName}? This action cannot be undone.`,
			)
		) {
			return;
		}
		try {
			const response = await fetch(
				`/api/cases/${caseId}/documents/${documentId}`,
				{
					method: 'DELETE',
				},
			);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete document');
			}
			toast.success(`Document "${documentName}" deleted successfully.`);
			uploadedDocuments = uploadedDocuments.filter(
				(doc) => doc.id !== documentId,
			);
		} catch (error) {
			console.error('Error deleting document:', error);
			toast.error(
				error instanceof Error ? error.message : 'Could not delete document.',
			);
		}
	}

	function formatBytes(bytes: number, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	// TODO: Add logic to determine if the case is a draft and editable.
	// For now, assume all actions are available.
	const isDraftCase = true;
</script>

<div class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>Upload Case Documents</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if isDraftCase}
				<div
					class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-primary"
					class:border-primary={dragOver}
					role="button"
					tabindex="0"
					on:dragenter={() => (dragOver = true)}
					on:dragover={(e) => {
						e.preventDefault();
						dragOver = true;
					}}
					on:dragleave={() => (dragOver = false)}
					on:drop={handleDrop}
					on:click={triggerFileInputClick}
					on:keydown={handleDragDropKeydown}
				>
					<UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
					<p class="mt-2 text-sm text-gray-600">
						Drag and drop files here, or click to select files.
					</p>
					<p class="text-xs text-gray-500">
						Allowed types: {ACCEPTED_FILE_EXTENSIONS}. Max size: {MAX_FILE_SIZE_MB}MB
						per file.
					</p>
					<Input
						type="file"
						id="fileInput"
						multiple
						accept={ACCEPTED_FILE_EXTENSIONS}
						on:change={handleFileSelect}
						class="hidden"
					/>
				</div>
			{:else}
				<p class="text-sm text-gray-600">
					File uploads are disabled for this case.
				</p>
			{/if}
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Uploaded Documents</CardTitle>
		</CardHeader>
		<CardContent>
			{#if isLoadingExisting}
				<p>Loading existing documents...</p>
			{:else if uploadedDocuments.length === 0}
				<p class="text-sm text-gray-500">
					No documents have been uploaded for this case yet.
				</p>
			{:else}
				<ul class="divide-y divide-gray-200">
					{#each uploadedDocuments as doc (doc.id)}
						<li class="flex items-center justify-between py-3">
							<div class="flex items-center space-x-3">
								<FileText class="h-6 w-6 text-primary" />
								<div>
									<p class="font-medium">{doc.file_name}</p>
									<p class="text-sm text-gray-500">
										{formatBytes(doc.file_size_bytes)} - Uploaded: {new Date(
											doc.uploaded_at,
										).toLocaleDateString()}
									</p>
								</div>
							</div>
							{#if isDraftCase}
								<Button
									variant="destructive"
									size="sm"
									on:click={() => deleteDocument(doc.id, doc.file_name)}
									aria-label="Delete document"
								>
									<Trash2 class="mr-1 h-4 w-4" /> Delete
								</Button>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
			{#if !isDraftCase && uploadedDocuments.length > 0}
				<p class="mt-4 text-sm text-gray-600">
					These documents are part of the submitted case and cannot be modified
					here.
				</p>
			{/if}
		</CardContent>
	</Card>
</div>

<style>
	/* Add any component-specific styles here if needed */
	.border-primary {
		border-color: hsl(
			var(--primary)
		); /* Assuming you have CSS variables for Shadcn theme */
	}
</style>
