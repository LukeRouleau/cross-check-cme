import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
} from '$env/static/public';
import {
	createBrowserClient,
	createServerClient,
	isBrowser,
	parse,
} from '@supabase/ssr';
import type { Database } from '$lib/database.types';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient<Database>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_ANON_KEY,
				{
					global: {
						fetch,
					},
					cookies: {
						get(key) {
							const cookie = parse(document.cookie);
							return cookie[key];
						},
					},
					auth: {
						flowType: 'pkce',
					},
				},
			)
		: createServerClient<Database>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_ANON_KEY,
				{
					global: {
						fetch,
					},
					cookies: {
						get() {
							return JSON.stringify(data.session);
						},
					},
					auth: {
						flowType: 'pkce',
					},
				},
			);

	const url = data.url;

	return { supabase, url };
};
