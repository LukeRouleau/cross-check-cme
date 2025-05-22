// import { PRIVATE_MAIL_FROM, PRIVATE_MAIL_TO } from '$env/static/private';
import { fail, type Actions, type ServerLoad } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
// import { z } from 'zod';
import { formSchema } from './schema';

export const load: ServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema)),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const supabaseServiceRole = event.locals.supabaseServiceRole;
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		const { name, email, subject, body } = form.data;

		// const transport = createTransport({
		// 	host: PRIVATE_SMTP_HOST,
		// 	port: Number(PRIVATE_SMTP_PORT),
		// 	secure: true,
		// 	auth: {
		// 		user: PRIVATE_SMTP_USER,
		// 		pass: PRIVATE_SMTP_PASSWORD,
		// 	},
		// });

		const { error: insertError } = await supabaseServiceRole
			.from('contact_messages')
			.insert({
				name,
				email,
				subject,
				body,
				// created_at defaults to now() in the database schema, so no need to set it here
				// updated_at is also optional and can be omitted or set to new Date().toISOString() if needed
			});

		// const send = transport.sendMail({
		// 	from: PRIVATE_MAIL_FROM,
		// 	to: PRIVATE_MAIL_TO,
		// 	subject: `Contact Form: ${subject}`,
		// 	text: body,
		// 	html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
		// });

		// let result;
		// if (insertError) {
		// 	console.error('Error inserting contact message:', insertError);
		// 	// Handle error appropriately
		// }

		try {
			// Removed Promise.all as it's not being used effectively here with the commented out sendMail
			if (insertError) {
				console.error('Error inserting contact message:', insertError);
				// Potentially return a fail() or throw the error to be caught by SvelteKit
				return fail(500, {
					message: 'Failed to submit contact message due to a database error.',
				});
			}
		} catch (e) {
			console.warn("Couldn't send contact request email or save message.", e);
			return fail(500, { message: 'An unexpected error occurred.' });
		}

		return message(form, {
			success: 'Thank you for your message. We will get back to you soon.',
		});
	},
};
