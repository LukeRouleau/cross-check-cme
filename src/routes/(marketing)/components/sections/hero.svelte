<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	// import { cn } from '$lib/utils'; // Removed as no longer used
	// import GitHubIcon from 'virtual:icons/lucide/github'; // Removed
	// import HeroAnimation from '../HeroAnimation.svelte'; // Removed

	const animatedPhrases = [
		'Strengthen Your Arguments',
		'Uncover Hidden Details',
		'Build a Winning Case'
	];
	let currentPhraseIndex = 0;

	onMount(() => {
		const interval = setInterval(() => {
			currentPhraseIndex = (currentPhraseIndex + 1) % animatedPhrases.length;
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<section class="relative z-0 border-b border-border overflow-hidden">
	<!-- Improved background element positioned absolutely -->
	<div class="absolute inset-0 -z-10" aria-hidden="true">
		<div class="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden blur-3xl">
			<div 
				class="aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] opacity-25" 
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
		<div class="absolute left-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
			<div 
				class="aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] opacity-25" 
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%); transform: rotate(180deg)"
			></div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-12 md:py-16 lg:py-20">
		<!-- Main Hero Content -->
		<div class="max-w-7xl mx-auto">
			<!-- Mobile Layout (Stack) -->
			<div class="lg:hidden space-y-8">
				<!-- Branding -->
				<div class="text-center space-y-3">
					<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
						CrossCheck<span class="text-primary italic">CME</span>
					</h1>
					<p class="text-lg text-muted-foreground max-w-md mx-auto">
						Expert Medical Exam Critiques for Legal Professionals.
					</p>
				</div>
				
				<!-- Product Image -->
				<div class="mx-auto w-full max-w-sm">
					<img 
						src="/images/cme-review.svg" 
						alt="Medical report critique example" 
						class="w-full h-auto object-contain"
					/>
				</div>
				
				<!-- Value Proposition -->
				<div class="text-center space-y-3">
					<p class="text-base sm:text-lg text-foreground/90">
						Pinpoint <span class="underline decoration-primary decoration-2 underline-offset-2">critical flaws</span> in Comprehensive Medical Exams.
					</p>
					<p class="text-base sm:text-lg text-foreground/90">
						Gain the insights you need to <span class="text-primary font-semibold">build a winning case.</span>
					</p>
				</div>
				
				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<Button href="/#contact" size="lg" class="text-base px-6 py-2.5 font-medium">
						Request Consultation
					</Button>
					<Button href="/#services" variant="outline" size="lg" class="text-base px-6 py-2.5 font-medium">
						Learn More
					</Button>
				</div>
			</div>
			
			<!-- Desktop Layout (Side by Side) -->
			<div class="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-center">
				<!-- Left Column (Branding & Image) -->
				<div class="space-y-6">
					<div class="space-y-3">
						<h1 class="text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
							CrossCheck<span class="text-primary italic">CME</span>
						</h1>
						<p class="text-xl text-muted-foreground">
							Expert Medical Exam Critiques for Legal Professionals.
						</p>
					</div>
					
					<!-- Product Image -->
					<div class="w-full max-w-md">
						<img 
							src="/images/cme-review.svg" 
							alt="Medical report critique example" 
							class="w-full h-auto object-contain"
						/>
					</div>
				</div>
				
				<!-- Right Column (Value Proposition & CTA) -->
				<div class="space-y-8">
					<!-- Value Proposition with Animation -->
					<div class="text-xl xl:text-2xl text-foreground/90 leading-relaxed">
						<p class="mb-4">Pinpoint <span class="underline decoration-primary decoration-2 underline-offset-2">critical flaws</span> in Comprehensive Medical Exams.</p>
						<p class="flex items-baseline flex-wrap">
							<span class="mr-2">Gain the insights you need to</span>
							<span class="relative inline-block animation-container h-8">
								<span class="invisible">strengthen your arguments.</span>
								{#key currentPhraseIndex}
									<span
										in:fly={{ y: 15, duration: 300, delay: 50 }}
										out:fly={{ y: -15, duration: 300 }}
										class="absolute left-0 top-0 text-primary font-semibold whitespace-nowrap"
									>
										{animatedPhrases[currentPhraseIndex].toLowerCase()}.
									</span>
								{/key}
							</span>
						</p>
					</div>
					
					<!-- CTA Buttons -->
					<div class="flex flex-row gap-4">
						<Button href="/#contact" size="lg" class="text-base px-6 py-3 font-medium">
							Request Consultation
						</Button>
						<Button href="/#services" variant="outline" size="lg" class="text-base px-6 py-3 font-medium">
							Learn More
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.animation-container {
		overflow: visible;
	}

	/* Apply filter in dark mode */
	:global(html.dark) img[src="/images/cme-review.svg"] {
		filter: invert(1) hue-rotate(180deg);
	}
</style>