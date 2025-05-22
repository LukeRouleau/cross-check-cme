import { redirect, fail } from '@sveltejs/kit';

export const load = async ({
	url,
	locals: { safeGetSession, supabaseServiceRole, stripe },
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return redirect(303, '/login');
	}

	// Get user's current product
	const { data: stripeCustomer, error } = await supabaseServiceRole
		.from('stripe_customers')
		.select('stripe_customer_id')
		.eq('user_id', user.id)
		.limit(1)
		.single();

	if (error) {
		console.error(error);
		return redirect(303, '/settings/billing');
	}

	const { stripe_customer_id } = stripeCustomer;

	if (!stripe_customer_id) {
		return fail(500, {
			error:
				'User does not have a Stripe customer ID. Cannot create billing portal session.',
		});
	}

	let billingPortalSessionUrl;
	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: stripe_customer_id,
			return_url: `${url.origin}/settings/billing`,
		});
		billingPortalSessionUrl = session.url;
	} catch (error) {
		console.error(error);
		return redirect(303, '/settings/billing');
	}

	redirect(303, billingPortalSessionUrl);
};
