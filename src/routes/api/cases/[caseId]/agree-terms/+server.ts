import { json, error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TablesUpdate, TablesInsert } from '$lib/database.types';

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
	const termsId = body.termsId as string | undefined;
	const agreed = body.agreed as boolean | undefined;

	if (typeof agreed !== 'boolean') {
		throw kitError(
			400,
			"Invalid agreement status: 'agreed' must be a boolean.",
		);
	}
	if (agreed && !termsId) {
		throw kitError(400, 'termsId is required when agreeing to terms');
	}

	console.log(
		`[API /agree-terms] User ${user.id} for case ${caseId}: termsId ${termsId}, agreed: ${agreed}`,
	);

	// Fetch the existing case to verify ownership and current state
	const { data: existingCase, error: caseFetchError } =
		await supabaseServiceRole
			.from('cases')
			.select('id, user_id, status, client_agreed_to_terms_id')
			.eq('id', caseId)
			.eq('user_id', user.id)
			.maybeSingle();

	if (caseFetchError) {
		console.error(
			`[API /agree-terms] Error fetching case ${caseId}:`,
			caseFetchError.message,
		);
		throw kitError(500, 'Error verifying case details.');
	}

	if (!existingCase) {
		throw kitError(404, 'Case not found or access denied.');
	}

	// Create the case update object, but don't apply it yet
	let userTermsAgreementId: string | null = null;

	// If agreeing to terms, we need to create or find a user_terms_agreement record first
	if (agreed && termsId) {
		// First, check if a user agreement for this user+terms already exists
		const { data: existingAgreement, error: agreementFetchError } = 
			await supabaseServiceRole
				.from('user_terms_agreement')
				.select('id')
				.eq('user_id', user.id)
				.eq('terms_id', termsId)
				.maybeSingle();
		
		if (agreementFetchError) {
			console.error(
				`[API /agree-terms] Error checking existing terms agreement:`,
				agreementFetchError.message
			);
			throw kitError(500, 'Error checking existing terms agreement.');
		}

		// If an agreement already exists, use it
		if (existingAgreement) {
			console.log(`[API /agree-terms] Found existing terms agreement ID: ${existingAgreement.id}`);
			userTermsAgreementId = existingAgreement.id;
		} 
		// Otherwise, create a new agreement record
		else {
			const termsAgreementData: TablesInsert<'user_terms_agreement'> = {
				user_id: user.id,
				terms_id: termsId,
				// agreed_at will be set to now() by default in the DB
			};

			const { data: newAgreement, error: insertError } = 
				await supabaseServiceRole
					.from('user_terms_agreement')
					.insert(termsAgreementData)
					.select('id')
					.single();
			
			if (insertError) {
				console.error(
					`[API /agree-terms] Error creating terms agreement:`,
					insertError.message
				);
				throw kitError(500, 'Failed to create terms agreement record.');
			}

			console.log(`[API /agree-terms] Created new terms agreement ID: ${newAgreement.id}`);
			userTermsAgreementId = newAgreement.id;
		}
	}

	// Now update the case with the user_terms_agreement ID (or null if retracting agreement)
	const updateData: TablesUpdate<'cases'> = {
		client_agreed_to_terms_id: userTermsAgreementId,
		// updated_at is handled by a DB trigger, no need to set it manually here
	};

	const { data: updatedCase, error: updateError } = await supabaseServiceRole
		.from('cases')
		.update(updateData)
		.eq('id', caseId)
		.select('*')
		.single();

	if (updateError) {
		console.error(
			`[API /agree-terms] Error updating case ${caseId}:`,
			updateError.message,
		);
		throw kitError(500, 'Failed to update terms agreement.');
	}

	console.log(
		`[API /agree-terms] Case ${caseId} updated successfully. Agreed to terms ID: ${updatedCase.client_agreed_to_terms_id}`,
	);
	return json(updatedCase);
};
