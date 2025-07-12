import { json, error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TablesUpdate } from '$lib/database.types';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
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
    const { instructions } = body;

    // Validate instructions
    if (typeof instructions !== 'string') {
        throw kitError(400, 'Instructions must be a string');
    }

    // Trim whitespace and check if empty
    const trimmedInstructions = instructions.trim();
    if (trimmedInstructions.length === 0) {
        throw kitError(400, 'Instructions cannot be empty');
    }

    // Optional: Add length validation
    if (trimmedInstructions.length > 5000) {
        throw kitError(400, 'Instructions cannot exceed 5000 characters');
    }

    console.log(
        `[API /instructions] User ${user.id} updating instructions for case ${caseId}`,
    );

    // Fetch the existing case to verify ownership
    const { data: existingCase, error: caseFetchError } =
        await supabaseServiceRole
            .from('cases')
            .select('id, user_id, custom_instructions')
            .eq('id', caseId)
            .eq('user_id', user.id)
            .maybeSingle();

    if (caseFetchError) {
        console.error(
            `[API /instructions] Error fetching case ${caseId}:`,
            caseFetchError.message,
        );
        throw kitError(500, 'Error verifying case details.');
    }

    if (!existingCase) {
        throw kitError(404, 'Case not found or access denied.');
    }

    // Update the case with new instructions
    const updateData: TablesUpdate<'cases'> = {
        custom_instructions: trimmedInstructions,
        // updated_at is handled by a DB trigger
    };

    const { error: updateError } = await supabaseServiceRole
        .from('cases')
        .update(updateData)
        .eq('id', caseId);

    if (updateError) {
        console.error(
            `[API /instructions] Error updating case ${caseId} instructions:`,
            updateError.message,
        );
        throw kitError(500, 'Failed to update case instructions.');
    }

    console.log(
        `[API /instructions] Case ${caseId} instructions updated successfully`,
    );

    // Return the updated case
    const { data: updatedCase, error: refetchError } = await supabaseServiceRole
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

    if (refetchError || !updatedCase) {
        console.error(
            `[API /instructions] Error refetching case ${caseId} after instructions update:`,
            refetchError?.message || 'Case not found after update',
        );
        return json(
            { message: 'Instructions updated, but failed to return updated case data.' },
            { status: 207 },
        );
    }

    return json(updatedCase);
};