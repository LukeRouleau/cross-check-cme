import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// No longer importing supabaseAdmin, will use locals.supabaseServiceRole

// --- Configuration (should match or be sourced from a shared config) ---
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/png',
];
// --- End Configuration ---

// GET /api/cases/[caseId]/documents - Fetches existing documents for a case
export const GET: RequestHandler = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession(); // Use safeGetSession
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const { caseId } = params;
	if (!caseId) {
		throw error(400, 'Case ID is required');
	}

	try {
		const { supabaseServiceRole } = locals; // Get the service role client

		// First, verify the user has access to this case (owns it or is admin)
		const { data: caseData, error: caseError } = await supabaseServiceRole
			.from('cases')
			.select('id, user_id, status')
			.eq('id', caseId)
			.single();

		if (caseError) {
			console.error('Error fetching case:', caseError);
			throw error(500, 'Error verifying case access');
		}
		if (!caseData) {
			throw error(404, 'Case not found');
		}

		// TODO: Add admin role check if needed for broader access for admins to see any case docs
		if (caseData.user_id !== user.id) {
			throw error(
				403,
				"Forbidden: You do not have access to this case's documents",
			);
		}

		const { data: documents, error: documentsError } = await supabaseServiceRole
			.from('case_documents')
			.select('id, file_name, file_type, file_size, uploaded_at') // Changed mime_type to file_type to match component
			.eq('case_id', caseId)
			.order('uploaded_at', { ascending: false });

		if (documentsError) {
			console.error('Error fetching documents:', documentsError);
			throw error(500, 'Failed to fetch documents');
		}

		return json(documents || []);
	} catch (e) {
		console.error('GET /documents error:', e);
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		throw error(500, 'An unexpected error occurred');
	}
};

// POST /api/cases/[caseId]/documents - Uploads new documents for a case
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { session, user } = await locals.safeGetSession(); // Use safeGetSession
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const { caseId } = params;
	if (!caseId) {
		throw error(400, 'Case ID is required');
	}

	try {
		const { supabaseServiceRole } = locals; // Get the service role client

		// Verify user owns the case and it's in a draft state
		const { data: caseData, error: caseError } = await supabaseServiceRole
			.from('cases')
			.select('id, user_id, status')
			.eq('id', caseId)
			.single();

		if (caseError) {
			console.error('Error fetching case for upload:', caseError);
			throw error(500, 'Error verifying case status');
		}
		if (!caseData) {
			throw error(404, 'Case not found');
		}
		if (caseData.user_id !== user.id) {
			throw error(403, 'Forbidden: You cannot upload documents to this case');
		}

		const caseStatus = caseData.status as string; // Assuming status is a string like 'draft'
		if (caseStatus !== 'draft') {
			// Ensure 'draft' matches your actual status enum/values
			throw error(
				403,
				`Forbidden: Documents can only be uploaded to draft cases. Current status: ${caseStatus}`,
			);
		}

		const formData = await request.formData();
		const files = formData.getAll('files') as File[];

		if (files.length === 0) {
			throw error(400, 'No files provided');
		}

		const uploadedDocumentRecords = [];

		for (const file of files) {
			if (!file.name || file.size === 0) {
				// Simplified check for valid file entry
				console.warn('Skipping invalid or empty file entry:', file.name);
				continue;
			}
			// File type (MIME) validation
			if (!ALLOWED_MIME_TYPES.includes(file.type)) {
				throw error(
					400,
					`Invalid file type: ${file.name} (${file.type}). Permitted: ${ALLOWED_MIME_TYPES.join(', ')}`,
				);
			}
			if (file.size > MAX_FILE_SIZE_BYTES) {
				throw error(
					400,
					`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Max: ${MAX_FILE_SIZE_MB} MB.`,
				);
			}

			// Placeholder for actual file upload to Supabase Storage
			// TODO: Implement Supabase Storage upload here. This will involve:
			// 1. Choosing a bucket (e.g., 'case-documents'). Ensure RLS is set up on the bucket.
			// 2. Generating a unique file path, e.g., `${user.id}/${caseId}/${crypto.randomUUID()}-${file.name}`
			// 3. Calling supabase.storage.from('bucket-name').upload(filePath, file);
			// For now, we'll just create the metadata record with a placeholder storage path.
			const storagePath = `user_uploads/${user.id}/${caseId}/${crypto.randomUUID()}-${file.name}`;

			const { data: newDocument, error: insertError } =
				await supabaseServiceRole
					.from('case_documents')
					.insert({
						case_id: caseId,
						user_id: user.id, // Track who uploaded
						file_name: file.name,
						file_type: file.type, // Changed from mime_type in DB to file_type to match component
						file_size: file.size, // Changed from file_size_bytes
						storage_path: storagePath,
						// uploaded_at is handled by db default (timestamptz)
					})
					.select('id, file_name, file_type, file_size, uploaded_at')
					.single();

			if (insertError) {
				console.error('Error inserting document record:', insertError);
				throw error(
					500,
					`Failed to save document metadata for ${file.name}: ${insertError.message}`,
				);
			}
			if (newDocument) {
				uploadedDocumentRecords.push(newDocument);
			}
		}

		return json(uploadedDocumentRecords, { status: 201 });
	} catch (e) {
		console.error('POST /documents error:', e);
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		throw error(500, 'An unexpected error occurred during file upload');
	}
};
