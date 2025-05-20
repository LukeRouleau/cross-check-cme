import type { Provider } from '@supabase/supabase-js';

export const WebsiteName: string = 'CrossCheckCME';

/* You'll need to configure your providers in
your Supabase project settings `/supabase/config.toml` */
export const oAuthProviders: Provider[] = [
	//
	// 'google',
	// 'twitter',
	// 'apple', // Consts $99/year to use Apple OAuth
	// 'facebook',
	// 'github',
];

/**
 * List of Stripe Product IDs to display in the billing settings page.
 * If set to `null`, all active products will be displayed.
 */
export const stripeProductIds: null | string[] = [
	'prod_SHpcTtw6cKV8sT', // Standard
	'prod_SHpssLfucp63L5', // Expedited
	'prod_SHqqgEX8zHWcAn', // Express
];
