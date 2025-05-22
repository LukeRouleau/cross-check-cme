import { json, error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TablesUpdate } from '$lib/database.types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { supabaseServiceRole, safeGetSession } = locals;
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw kitError(401, 'Unauthorized');
	}

	const { caseId } = params;
	if (!caseId) {
		throw kitError(400, 'Case ID is required');
	}

	const body = await request.json();
	const newStepId = body.stepId as string | undefined;

	if (!newStepId) {
		throw kitError(400, 'stepId is required in the request body.');
	}

	// TODO: Optional: Validate newStepId against a known list of valid step IDs if necessary

	console.log(
		`[API /set-current-step] User ${user.id} attempting to set step for case ${caseId} to ${newStepId}`,
	);

	// Fetch the existing case to verify ownership
	const { data: existingCase, error: caseFetchError } =
		await supabaseServiceRole
			.from('cases')
			.select('id, user_id, case_initiation_step_id') // Select current step to potentially avoid redundant updates or allow more complex logic
			.eq('id', caseId)
			.eq('user_id', user.id)
			.maybeSingle();

	if (caseFetchError) {
		console.error(
			`[API /set-current-step] Error fetching case ${caseId}:`,
			caseFetchError.message,
		);
		throw kitError(500, 'Error verifying case details.');
	}

	if (!existingCase) {
		throw kitError(404, 'Case not found or access denied.');
	}

	// Optional: Add logic here if you only want to allow advancing the step,
	// e.g., compare index of newStepId with index of existingCase.case_initiation_step_id.
	// For now, we'll allow setting it directly.

	const updateData: TablesUpdate<'cases'> = {
		case_initiation_step_id: newStepId,
		// updated_at is handled by a DB trigger
	};

	const { error: updateError } = await supabaseServiceRole
		.from('cases')
		.update(updateData)
		.eq('id', caseId);

	if (updateError) {
		console.error(
			`[API /set-current-step] Error updating case ${caseId} step:`,
			updateError.message,
		);
		throw kitError(500, 'Failed to update case current step.');
	}

	console.log(
		`[API /set-current-step] Case ${caseId} current_initiation_step_id updated to ${newStepId}`,
	);

	// Return the updated step or the whole case? For now, just success.
	// To align with other endpoints, refetching and returning the case might be better.
	const { data: updatedCase, error: refetchError } = await supabaseServiceRole
		.from('cases')
		.select('*')
		.eq('id', caseId)
		.single();

	if (refetchError || !updatedCase) {
		console.error(
			`[API /set-current-step] Error refetching case ${caseId} after step update:`,
			refetchError?.message || 'Case not found after update',
		);
		// Don't fail the whole operation if refetch fails, primary goal was to update step.
		// But client might rely on updated caseItem.
		return json(
			{ message: 'Step updated, but failed to return updated case data.' },
			{ status: 207 },
		);
	}

	return json(updatedCase);
};
