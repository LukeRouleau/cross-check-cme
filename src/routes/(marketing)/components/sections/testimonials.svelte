<script lang="ts">
	import * as Testimonials from '$lib/components/landing/testimonials';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import Autoplay from 'embla-carousel-autoplay';
	import UserIcon from '~icons/lucide/user';

	const testimonials = [
		{
			author: {
				avatarUrl:
					'https://www.forthepeople.com/sites/default/files/styles/max_650x650_webp/public/2025-02/John_Berke_1000x1000.png.webp?itok=pR966X_o',
				name: 'John Berke',
				sub: 'Attorney at Law',
			},
			quote:
				"I have been working with Physical Therapist Paul Rouleau to review the CME report, CME video, and CME deposition transcript in detail. He meticulously critiques the CME doctor's evaluation, identifying areas for scrutiny. Paul provides a comprehensive redline report that highlights tests the CME doctor performed incorrectly, tests claimed to have been completed in the report but were not done, tests that should have been done and key questions to ask the CME doctor during testimony. Additionally, his report includes precise timestamps to quickly locate relevant sections in the video. Paul charges $750 for this service and offers a quick turnaround. He serves as a consultant, not a retained expert.",
		},
		{
			author: {
				avatarUrl: '#',
				name: 'Jane Doe',
				sub: 'Medical Expert',
			},
			quote:
				'This service is invaluable for case preparation. The detailed analysis helped me understand the nuances of the medical examination.',
		},
		{
			author: {
				avatarUrl: '#',
				name: 'Robert Smith',
				sub: 'Legal Counsel',
			},
			quote:
				'Quick, efficient, and thorough. The reports are easy to understand and extremely helpful in deposition.',
		},
		{
			author: {
				avatarUrl: '#',
				name: 'Alice Brown',
				sub: 'Paralegal',
			},
			quote:
				'The insights provided saved us countless hours of work. Highly recommend for any legal team dealing with CMEs.',
		},
	];
</script>

<Testimonials.Root class="hidden md:grid lg:block">
	{#if testimonials.length > 0}
		{#each testimonials as { author: { avatarUrl, name, sub }, quote }}
			<Testimonials.Figure>
				<Card.Root>
					<Testimonials.Author>
						<Card.Header class="flex flex-row items-center gap-4">
							<Avatar.Root>
								<Avatar.Image src={avatarUrl} alt={name} />
								<Avatar.Fallback>
									<UserIcon />
								</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<Card.Title>{name}</Card.Title>
								<Card.Description>{sub}</Card.Description>
							</div>
						</Card.Header>
					</Testimonials.Author>
					<Card.Content>
						<Testimonials.Quote>"{quote}"</Testimonials.Quote>
					</Card.Content>
				</Card.Root>
			</Testimonials.Figure>
		{/each}
	{:else}
		<p class="text-center text-muted-foreground">
			No testimonials yet. Check back soon!
		</p>
	{/if}
</Testimonials.Root>

<Carousel.Root
	class="md:hidden"
	opts={{ loop: testimonials.length > 1 }}
	plugins={[
		Autoplay({
			delay: 7000,
			stopOnInteraction: true,
		}),
	]}
>
	<Testimonials.Root variant="carousel">
		<Carousel.Content>
			{#if testimonials.length > 0}
				{#each testimonials as { author: { avatarUrl, name, sub }, quote }, i (i)}
					<Carousel.Item>
						<Testimonials.Figure>
							<Card.Root class="h-full">
								<Testimonials.Author>
									<Card.Header class="flex flex-row items-center gap-4">
										<Avatar.Root>
											<Avatar.Image src={avatarUrl} alt={name} />
											<Avatar.Fallback>
												<UserIcon />
											</Avatar.Fallback>
										</Avatar.Root>
										<div>
											<Card.Title>{name}</Card.Title>
											<Card.Description>{sub}</Card.Description>
										</div>
									</Card.Header>
								</Testimonials.Author>
								<Card.Content>
									<Testimonials.Quote>"{quote}"</Testimonials.Quote>
								</Card.Content>
							</Card.Root>
						</Testimonials.Figure>
					</Carousel.Item>
				{/each}
			{:else}
				<Carousel.Item>
					<p class="p-4 text-center text-muted-foreground">
						No testimonials yet. Check back soon!
					</p>
				</Carousel.Item>
			{/if}
		</Carousel.Content>
	</Testimonials.Root>
	{#if testimonials.length > 1}
		<Carousel.Previous class="translate-x-full" />
		<Carousel.Next class="-translate-x-full" />
	{/if}
</Carousel.Root>
