export const csr = false;

import { fetchSortedProducts } from '$lib/stripe/client-helpers';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	locals: { safeGetSession, supabaseServiceRole, stripe },
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return redirect(303, '/login');
	}

	const products = await fetchSortedProducts(stripe);

	// Get user's current product
	const { data: stripeCustomer, error } = await supabaseServiceRole
		.from('stripe_customers')
		.select('stripe_customer_id')
		.eq('user_id', user.id)
		.limit(1)
		.single();

	if (error) {
		console.error(error);
		return { products };
	}

	const { stripe_customer_id } = stripeCustomer;

	if (!stripe_customer_id) {
		// If there's no stripe_customer_id, the user has no subscriptions with Stripe.
		// Return empty or appropriate data structure.
		return {
			activeProducts: [],
			portalSessionUrl: null, // Or handle as needed
		};
	}

	const { data: subscriptions } = await stripe.subscriptions.list({
		customer: stripe_customer_id, // Now guaranteed to be a string
		limit: 100,
	});

	return {
		products,
		// userProducts,
		currentSubscriptions: subscriptions,
	};
};
