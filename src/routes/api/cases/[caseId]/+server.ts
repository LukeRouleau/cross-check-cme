import { json, error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { supabaseServiceRole, safeGetSession } = locals;
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw kitError(401, 'Unauthorized');
	}

	const { caseId } = params;
	if (!caseId) {
		throw kitError(400, 'Case ID is required');
	}

	console.log(
		`[API /cases DELETE] Verifying case ${caseId} belongs to user ${user.id} and is a draft`,
	);

	// First, verify the case exists, belongs to the user, and is in 'draft' status
	const { data: caseItem, error: fetchError } = await supabaseServiceRole
		.from('cases')
		.select('id, user_id, status')
		.eq('id', caseId)
		.eq('user_id', user.id)
		.eq('status', 'draft') // Only allow deletion of draft cases
		.maybeSingle();

	if (fetchError) {
		console.error(
			`[API /cases DELETE] Error fetching case ${caseId}:`,
			fetchError.message,
		);
		throw kitError(500, 'Error verifying case details.');
	}

	if (!caseItem) {
		console.warn(
			`[API /cases DELETE] Case ${caseId} not found, not owned by user ${user.id}, or not in draft status.`,
		);
		throw kitError(
			404,
			'Case not found, or not in draft status. Only draft cases can be deleted.',
		);
	}

	// Delete any associated documents (if already present)
	const { error: docDeleteError } = await supabaseServiceRole
		.from('case_documents')
		.delete()
		.eq('case_id', caseId);

	if (docDeleteError) {
		console.error(
			`[API /cases DELETE] Error deleting case documents for ${caseId}:`,
			docDeleteError.message,
		);
		// Continue with case deletion even if document deletion fails
		// We'll log the error but not abort, to avoid orphaned documents
	}

	// Delete the case
	const { error: deleteError } = await supabaseServiceRole
		.from('cases')
		.delete()
		.eq('id', caseId);

	if (deleteError) {
		console.error(
			`[API /cases DELETE] Error deleting case ${caseId}:`,
			deleteError.message,
		);
		throw kitError(500, 'Failed to delete case.');
	}

	console.log(`[API /cases DELETE] Successfully deleted case ${caseId}`);
	// Return 200 OK with a message
	return json({ message: 'Case deleted successfully' });
};
