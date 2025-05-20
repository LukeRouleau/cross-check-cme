<script lang="ts">
	import * as Section from '$lib/components/landing/section';
	import { WebsiteName } from './../../config';
	// import Features from './components/sections/features/features.svelte'; // Replaced by OurServices
	import HeroSection from './components/sections/hero.svelte';
	// import LogosCloud from './components/sections/logos-cloud.svelte'; // Removed
	import Pricing from './components/sections/pricing.svelte';
	import Testimonials from './components/sections/testimonials.svelte'; // To be updated
	import AboutPaul from './components/sections/about-paul.svelte'; // New component
	import OurServices from './components/sections/our-services.svelte'; // New component for services

	export let data;

	const { prices } = data;
</script>

<svelte:head>
	<title>{WebsiteName} - Expert CME Report Analysis</title>
</svelte:head>

<div class="mb-24 flex flex-col gap-14 sm:gap-16">
	<Section.Root>
		<HeroSection />
	</Section.Root>
	<Section.Root anchor="services">
		<Section.Header>
			<Section.Title>Our <span class="text-primary">Services</span></Section.Title>
			<Section.Description class="text-balance">
				Detailed analysis and strategic insights to give you a critical edge in your legal cases.
			</Section.Description>
		</Section.Header>
		<OurServices />
	</Section.Root>
	<Section.Root anchor="about">
		<Section.Header>
			<Section.Title>About <span class="text-primary">Paul Rouleau</span></Section.Title>
			<Section.Description class="text-balance">
				Meet the expert behind CrossCheckCME.
			</Section.Description>
		</Section.Header>
		<AboutPaul />
	</Section.Root>
	<Section.Root anchor="testimonials">
		<Section.Header>
			<Section.Title>What Experts Are <span class="text-primary">Saying</span></Section.Title>
		</Section.Header>
		<Testimonials />
	</Section.Root>
	<Section.Root anchor="pricing">
		<Section.Header>
			<Section.Title>Service <span class="text-primary">Pricing</span></Section.Title>
			<Section.Description class="text-balance">
				Transparent pricing for comprehensive CME report analysis. Standard turnaround is typically [Specify Timeframe e.g., 5-7 business days]. Expedited services available.
			</Section.Description>
		</Section.Header>
		<Pricing {prices} />
	</Section.Root>
</div>
