<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="container mx-auto px-4 py-8 md:py-12">
	<div class="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
		<div>
			<!-- Placeholder for an image of Paul Rouleau if available -->
			<img src="/images/paul-rouleau-headshot2.png" alt="Paul Rouleau" class="w-full max-w-sm mx-auto rounded-lg shadow-xl mb-6 md:mb-4" />
			<div class="space-y-4 text-center max-w-sm mx-auto">
				<h3 class="text-2xl font-bold tracking-tight sm:text-3xl text-primary">
					Paul Rouleau<br>PT, OCS, COMT, FAAOMPT
				</h3>
			</div>
		</div>
		<div class="space-y-6">
			<p class="text-lg text-muted-foreground">
				<strong>Paul is the founder of CrossCheckCME</strong> and a nationally 
				recognized consultant specializing in the critical review of medical Compulsory Medical 
				Examinations (CMEs) for legal professionals. With over 31 years of experience as an 
				orthopedic physical therapist, Paul holds advanced credentials as an Orthopedic Clinical 
				Specialist, Certified Orthopedic Manual Physical Therapist, and is a Fellow of the 
				American Academy of Orthopaedic Manual Physical Therapists. Paul is also the Principal Therapist
				and Co-Owner of Orthopedic Physical Therapy Associates, LLC.
			</p>
			<p class="text-lg text-muted-foreground">
				For the past ten years, Paul has provided detailed, case-strengthening analyses of CME 
				reports, videos, and deposition transcripts. His comprehensive critiques play a critical role
				in his attorneys' success in trial. Paul offers this high-value service with a fast turnaround time
				and attention to detail.
			</p>
			<div class="mt-6 flex flex-col gap-2 min-[400px]:flex-row">
				<Button href="/#contact" size="lg">Request a Consultation</Button>
				<Button href="/#services" variant="outline" size="lg">Learn About Our Services</Button>
			</div>
		</div>
	</div>
</div> 