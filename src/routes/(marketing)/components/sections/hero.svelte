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
		'Build a Winning Case',
	];
	let currentPhraseIndex = 0;

	onMount(() => {
		const interval = setInterval(() => {
			currentPhraseIndex = (currentPhraseIndex + 1) % animatedPhrases.length;
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<section class="relative z-0 overflow-hidden border-b border-border">
	<!-- Improved background element positioned absolutely -->
	<div class="absolute inset-0 -z-10" aria-hidden="true">
		<div
			class="absolute right-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
		>
			<div
				class="aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] opacity-25"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
		<div
			class="absolute bottom-0 left-0 -z-10 transform-gpu overflow-hidden blur-3xl"
		>
			<div
				class="aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] opacity-25"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%); transform: rotate(180deg)"
			></div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-12 md:py-16 lg:py-20">
		<!-- Main Hero Content -->
		<div class="mx-auto max-w-7xl">
			<!-- Mobile Layout (Stack) -->
			<div class="space-y-8 lg:hidden">
				<!-- Branding -->
				<div class="space-y-3 text-center">
					<h1
						class="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
					>
						CrossCheck<span class="italic text-primary">CME</span>
					</h1>
					<p class="mx-auto max-w-md text-lg text-muted-foreground">
						Expert Medical Exam Critiques for Legal Professionals.
					</p>
				</div>

				<!-- Product Image -->
				<div class="mx-auto w-full max-w-sm">
					<img
						src="/images/cme-review.svg"
						alt="Medical report critique example"
						class="h-auto w-full object-contain"
					/>
				</div>

				<!-- Value Proposition -->
				<div class="space-y-3 text-center">
					<p class="text-base text-foreground/90 sm:text-lg">
						Pinpoint <span
							class="underline decoration-primary decoration-2 underline-offset-2"
							>critical flaws</span
						> in Comprehensive Medical Exams.
					</p>
					<p class="text-base text-foreground/90 sm:text-lg">
						Gain the insights you need to <span
							class="font-semibold text-primary">build a winning case.</span
						>
					</p>
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<Button
						href="/#contact"
						size="lg"
						class="px-6 py-2.5 text-base font-medium"
					>
						Request Consultation
					</Button>
					<Button
						href="/#services"
						variant="outline"
						size="lg"
						class="px-6 py-2.5 text-base font-medium"
					>
						Learn More
					</Button>
				</div>
			</div>

			<!-- Desktop Layout (Side by Side) -->
			<div class="hidden items-center lg:grid lg:grid-cols-2 lg:gap-12">
				<!-- Left Column (Branding & Image) -->
				<div class="space-y-6">
					<div class="space-y-3">
						<h1
							class="text-5xl font-bold leading-[1.1] tracking-tight text-foreground xl:text-6xl"
						>
							CrossCheck<span class="italic text-primary">CME</span>
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
							class="h-auto w-full object-contain"
						/>
					</div>
				</div>

				<!-- Right Column (Value Proposition & CTA) -->
				<div class="space-y-8">
					<!-- Value Proposition with Animation -->
					<div class="text-xl leading-relaxed text-foreground/90 xl:text-2xl">
						<p class="mb-4">
							Pinpoint <span
								class="underline decoration-primary decoration-2 underline-offset-2"
								>critical flaws</span
							> in Comprehensive Medical Exams.
						</p>
						<p class="flex flex-wrap items-baseline">
							<span class="mr-2">Gain the insights you need to</span>
							<span class="animation-container relative inline-block h-8">
								<span class="invisible">strengthen your arguments.</span>
								{#key currentPhraseIndex}
									<span
										in:fly={{ y: 15, duration: 300, delay: 50 }}
										out:fly={{ y: -15, duration: 300 }}
										class="absolute left-0 top-0 whitespace-nowrap font-semibold text-primary"
									>
										{animatedPhrases[currentPhraseIndex].toLowerCase()}.
									</span>
								{/key}
							</span>
						</p>
					</div>

					<!-- CTA Buttons -->
					<div class="flex flex-row gap-4">
						<Button
							href="/#contact"
							size="lg"
							class="px-6 py-3 text-base font-medium"
						>
							Request Consultation
						</Button>
						<Button
							href="/#services"
							variant="outline"
							size="lg"
							class="px-6 py-3 text-base font-medium"
						>
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
	:global(html.dark) img[src='/images/cme-review.svg'] {
		filter: invert(1) hue-rotate(180deg);
	}
</style>
