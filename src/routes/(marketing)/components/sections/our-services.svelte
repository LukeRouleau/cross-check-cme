<script lang="ts">
	import SearchCheckIcon from 'virtual:icons/lucide/search-check';
	import AlertTriangleIcon from 'virtual:icons/lucide/alert-triangle';
	import MessageCircleQuestionIcon from 'virtual:icons/lucide/message-circle-question';
	import UserCheckIcon from 'virtual:icons/lucide/user-check';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import XCircleIcon from 'virtual:icons/lucide/x-circle';
	import InfoIcon from 'virtual:icons/lucide/info';
</script>

<div class="container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
	<div class="service-item rounded-lg border bg-card p-6 shadow transition-all hover:shadow-lg">
		<div class="mb-3 flex items-center gap-3">
			<SearchCheckIcon class="h-8 w-8 shrink-0 text-primary" />
			<h3 class="text-xl font-semibold">Meticulous CME Review</h3>
		</div>
		<p class="text-muted-foreground">
			Comprehensive critique of CME reports, with flaws, oversights, and lines of 
			inquiry directly annotated within the transcript or report.
		</p>
	</div>
	<div class="service-item rounded-lg border bg-card p-6 shadow transition-all hover:shadow-lg">
		<div class="mb-3 flex items-center gap-3">
			<AlertTriangleIcon class="h-8 w-8 shrink-0 text-primary" />
			<h3 class="text-xl font-semibold">Identification of Flaws</h3>
		</div>
		<p class="text-muted-foreground">
			Uncover omitted tests, failures of assessment, and
			other areas of scrutiny that may be problematic for the defense.
		</p>
	</div>
	<div class="service-item rounded-lg border bg-card p-6 shadow transition-all hover:shadow-lg">
		<div class="mb-3 flex items-center gap-3">
			<MessageCircleQuestionIcon class="h-8 w-8 shrink-0 text-primary" />
			<h3 class="text-xl font-semibold">Strategic Questioning</h3>
		</div>
		<p class="text-muted-foreground">
			Provide targeted questions for attorneys to use in depositions or
			cross-examinations, designed to challenge the CME doctor's findings.
		</p>
	</div>
	<div class="service-item rounded-lg border bg-card p-6 shadow transition-all hover:shadow-lg">
		<div class="mb-3 flex items-center gap-3">
			<UserCheckIcon class="h-8 w-8 shrink-0 text-primary" />
			<h3 class="text-xl font-semibold">Consultant, Not Retained</h3>
		</div>
		<p class="text-muted-foreground">
			Benefit from expert insights and analysis without the costs and commitments of a formally
			retained expert witness.
		</p>
	</div>
	<div class="service-item rounded-lg border bg-card p-6 shadow transition-all hover:shadow-lg">
		<div class="mb-3 flex items-center gap-3">
			<ZapIcon class="h-8 w-8 shrink-0 text-primary" />
			<h3 class="text-xl font-semibold">Quick Turnaround</h3>
		</div>
		<p class="text-muted-foreground">
			Efficient service delivery to meet your case deadlines. A variety of turnaround times
			are available.
		</p>
	</div>

	<div class="service-item rounded-lg border bg-card p-6 shadow transition-all hover:shadow-lg">
		<div class="mb-3 flex items-center gap-3">
			<InfoIcon class="h-8 w-8 shrink-0 text-amber-500" />
			<h3 class="text-xl font-semibold">Limitations</h3>
		</div>
		<ul class="space-y-2 text-muted-foreground">
			<li class="flex items-start">
				<XCircleIcon class="mr-2 mt-1 h-5 w-5 shrink-0 text-amber-600" />
				<span>Does not serve as a retained expert witness for trial testimony.</span>
			</li>
			<li class="flex items-start">
				<XCircleIcon class="mr-2 mt-1 h-5 w-5 shrink-0 text-amber-600" />
				<span>Does not provide analysis regarding psychological or psychiatric issues.</span>
			</li>
		</ul>
	</div>
</div> 