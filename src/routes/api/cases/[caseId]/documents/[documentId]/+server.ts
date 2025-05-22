import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const { caseId, documentId } = params;
	if (!caseId || !documentId) {
		throw error(400, 'Case ID and Document ID are required');
	}

	try {
		const { supabaseServiceRole } = locals;

		// Fetch the document and its associated case to verify ownership and status
		const { data: documentData, error: documentError } =
			await supabaseServiceRole
				.from('case_documents')
				.select(
					`
				id,
				storage_path,
				cases (id, user_id, status)
			`,
				)
				.eq('id', documentId)
				.eq('case_id', caseId)
				.single();

		if (documentError) {
			console.error('Error fetching document for deletion:', documentError);
			throw error(500, 'Error verifying document');
		}

		if (!documentData) {
			throw error(404, 'Document not found');
		}

		const caseDetails = documentData.cases as {
			id: string;
			user_id: string;
			status: string;
		} | null;

		if (!caseDetails) {
			// This should not happen if the foreign key constraint is in place and document was found for the caseId
			console.error('Case details not found for document:', documentId, caseId);
			throw error(500, 'Internal error: Case details missing for document.');
		}

		if (caseDetails.user_id !== user.id) {
			throw error(403, "Forbidden: You do not own this document's case");
		}

		if (caseDetails.status !== 'draft') {
			throw error(
				403,
				'Forbidden: Documents can only be deleted from draft cases',
			);
		}

		// TODO: Step 1: Delete from Supabase Storage
		// const { error: storageError } = await supabaseServiceRole.storage
		// 	.from('case-documents') // Replace with your actual bucket name
		// 	.remove([documentData.storage_path]);

		// if (storageError) {
		// 	console.error('Error deleting file from storage:', storageError);
		//  // Decide if you should still delete the DB record or return an error
		// 	throw error(500, 'Failed to delete file from storage');
		// }

		// Step 2: Delete the document record from the database
		const { error: deleteDbError } = await supabaseServiceRole
			.from('case_documents')
			.delete()
			.eq('id', documentId);

		if (deleteDbError) {
			console.error('Error deleting document record:', deleteDbError);
			throw error(500, 'Failed to delete document record');
		}

		return json({ message: 'Document deleted successfully' }, { status: 200 });
	} catch (e) {
		console.error('DELETE /documents/[documentId] error:', e);
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		throw error(
			500,
			'An unexpected error occurred while deleting the document',
		);
	}
};
