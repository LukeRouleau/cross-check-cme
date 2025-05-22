import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { safeGetSession, supabaseServiceRole } = locals;
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw error(401, 'Unauthorized');
	}

	const { caseId } = params;

	if (!caseId) {
		throw error(400, 'Case ID is required');
	}

	console.log(
		`[Case Initiate +page.server.ts] Fetching case details for case ID: ${caseId}, user ID: ${user.id}`,
	);

	const { data: caseItem, error: caseError } = await supabaseServiceRole
		.from('cases')
		.select('*')
		.eq('id', caseId)
		.eq('user_id', user.id)
		.maybeSingle();

	if (caseError) {
		console.error(
			`[Case Initiate +page.server.ts] Error fetching case: ${caseError.message}`,
		);
		throw error(500, 'Failed to load case details');
	}

	if (!caseItem) {
		console.warn(
			`[Case Initiate +page.server.ts] Case not found or access denied for case ID: ${caseId}, user ID: ${user.id}`,
		);
		throw error(404, 'Case not found or you do not have access to it.');
	}

	console.log(
		`[Case Initiate +page.server.ts] Case details fetched successfully for case ID: ${caseId}`,
	);

	return {
		caseItem,
	};
};
