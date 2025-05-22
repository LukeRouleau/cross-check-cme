import { json, error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Database } from '$lib/database.types'; // Corrected import

// Define a type for a single row from terms_of_service table
type TermsOfServiceRow =
	Database['public']['Tables']['terms_of_service']['Row'];

export const GET: RequestHandler = async ({
	locals: { supabaseServiceRole, safeGetSession },
}) => {
	// Although fetching ToS is public, we might want to log who is fetching or apply rate limits later.
	// For now, we ensure a session exists but don't strictly tie it to a user for this particular GET.
	const { session } = await safeGetSession();
	if (!session) {
		throw kitError(401, 'Unauthorized: Session required to fetch ToS.');
	}

	console.log('[api/terms/latest] Attempting to fetch latest Terms of Service');

	const { data: latestTerms, error } = await supabaseServiceRole
		.from('terms_of_service')
		.select('*')
		.eq('is_latest', true)
		.maybeSingle<TermsOfServiceRow>(); // Specify the type for maybeSingle

	if (error) {
		console.error(
			'[api/terms/latest] Error fetching latest ToS:',
			error.message,
		);
		throw kitError(500, 'Failed to fetch latest Terms of Service.');
	}

	if (!latestTerms) {
		console.warn(
			'[api/terms/latest] No Terms of Service marked as latest found.',
		);
		throw kitError(404, 'No latest Terms of Service found.');
	}

	console.log(
		'[api/terms/latest] Latest Terms of Service fetched successfully:',
		latestTerms.version,
	);
	return json(latestTerms);
};
