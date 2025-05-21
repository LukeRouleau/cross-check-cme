<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div>
	<div class="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
		<div>
			<img
				src="/images/paul-rouleau-headshot2.png"
				alt="Paul Rouleau"
				class="mx-auto mb-6 w-full max-w-sm rounded-lg shadow-xl md:mb-4"
			/>
			<div class="mx-auto max-w-sm space-y-4 text-center">
				<h3 class="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
					Paul Rouleau<br />PT, OCS, COMT, FAAOMPT
				</h3>
			</div>
		</div>
		<div class="space-y-6">
			<p class="text-lg text-muted-foreground">
				<strong>Paul is the founder of CrossCheckCME</strong> and a nationally recognized
				consultant specializing in the critical review of medical Compulsory Medical
				Examinations (CMEs) for legal professionals. With over 31 years of experience
				as an orthopedic physical therapist, Paul holds advanced credentials as an
				Orthopedic Clinical Specialist, Certified Orthopedic Manual Physical Therapist,
				and is a Fellow of the American Academy of Orthopaedic Manual Physical Therapists.
				Paul is also the Principal Therapist and Co-Owner of Orthopedic Physical
				Therapy Associates, LLC.
			</p>
			<p class="text-lg text-muted-foreground">
				For the past ten years, Paul has provided detailed, case-strengthening
				analyses of CME reports, videos, and deposition transcripts. His
				comprehensive critiques play a critical role in his attorneys' success
				in trial. Paul offers this high-value service with a fast turnaround
				time and attention to detail.
			</p>
			<div
				class="mt-6 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:justify-center"
			>
				<Button href="/#contact" size="lg">Request a Consultation</Button>
				<Button href="/#services" variant="outline" size="lg"
					>Learn About Our Services</Button
				>
			</div>
		</div>
	</div>
</div>
