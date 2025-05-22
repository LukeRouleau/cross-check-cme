import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database.types';

type CaseRow = Database['public']['Tables']['cases']['Row'];
type AdminSettingsRow = Database['public']['Tables']['admin_settings']['Row'];

export const load: PageServerLoad = async ({
	locals: { supabase, safeGetSession },
}) => {
	const { session } = await safeGetSession();
	if (!session) {
		// This should be caught by the layout.server.ts redirect, but as a fallback:
		return fail(401, { message: 'Unauthorized' });
	}

	const fetchCases = async () => {
		console.log(
			'[+page.server.ts] Fetching cases for user ID:',
			session?.user?.id,
		);
		const { data, error } = await supabase
			.from('cases')
			.select('*')
			.eq('user_id', session.user.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching cases:', error);
			return [] as CaseRow[];
		}
		console.log('[+page.server.ts] Cases fetched:', data?.length);
		return data as CaseRow[];
	};

	const fetchAdminSettings = async () => {
		const { data, error } = await supabase
			.from('admin_settings')
			.select('*')
			.eq('singleton_id', true)
			.maybeSingle();

		if (error) {
			console.error('Error fetching admin settings:', error);
			return null;
		}
		return data as AdminSettingsRow | null;
	};

	return {
		userCases: await fetchCases(),
		adminSettings: await fetchAdminSettings(),
		streamed: {
			// Example for future use if needed, not strictly necessary for these two calls
			// cases: new Promise((fulfil) => fulfil(await fetchCases())),
			// settings: new Promise((fulfil) => fulfil(await fetchAdminSettings()))
		},
	};
};
