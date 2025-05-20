<script lang="ts">
	import * as Pricing from '$lib/components/landing/pricing';
	import * as Card from '$lib/components/ui/card';
	import Stripe from 'stripe';
	import * as Price from '../../../../lib/components/price/index.js';

	// Icon imports
	import ClockIcon from '~icons/lucide/clock';
	import ClipboardListIcon from '~icons/lucide/clipboard-list';
	import FilePenLineIcon from '~icons/lucide/file-pen-line';
	import GavelIcon from '~icons/lucide/gavel';
	import HelpCircleIcon from '~icons/lucide/help-circle';
	import SearchSlashIcon from '~icons/lucide/search-slash';
	import CheckCircleIcon from '~icons/lucide/check-circle';
	import TrendingUpIcon from '~icons/lucide/trending-up';
	import ZapIcon from '~icons/lucide/zap';
	import AlertOctagonIcon from '~icons/lucide/alert-octagon';

	type Price = Stripe.Price & {
		product: Stripe.Product;
	};
	export let prices: readonly [Price, Price, Price];
</script>

<Pricing.Root>
	<Pricing.Plan>
		<Card.Root class="relative">
			<div class="absolute right-5 top-1.5">
				<Price.Badges price={prices[0]} />
			</div>
			<Card.Header>
				<Card.Title>{prices[0].product.name}</Card.Title>
				<Card.Description>
					{prices[0].product.description ?? ''}
				</Card.Description>
			</Card.Header>
			<Price.Core price={prices[0]}>
				<Card.Content class="flex flex-col gap-6">
					<Price.Amount price={prices[0]} />
					<Price.Button price={prices[0]}>Select Standard</Price.Button>
				</Card.Content>
			</Price.Core>
			<Card.Footer>
				<Pricing.PlanFeatures>
					<Pricing.FeatureItem icon={ClipboardListIcon} iconClass="text-muted-foreground">
						Complete analysis of the defense's medical examinations
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={FilePenLineIcon} iconClass="text-muted-foreground">
						Detailed inline transcript annotations
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={GavelIcon} iconClass="text-muted-foreground">
						In-depth medical critique
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={HelpCircleIcon} iconClass="text-muted-foreground">
						Targeted cross-examination questions
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={SearchSlashIcon} iconClass="text-muted-foreground">
						Identifies incorrect tests, omissions & inconsistencies
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={ClockIcon} iconClass="text-sky-600">
						Delivered within 20 business days
					</Pricing.FeatureItem>
				</Pricing.PlanFeatures>
			</Card.Footer>
		</Card.Root>
	</Pricing.Plan>
	<Pricing.Plan emphasized>
		<Card.Root class="relative">
			<div class="absolute right-2 top-1.5">
				<Price.Badges price={prices[1]} />
			</div>
			<Card.Header>
				<Card.Title>{prices[1].product.name}</Card.Title>
				<Card.Description>
					{prices[1].product.description ?? ''}
				</Card.Description>
			</Card.Header>
			<Price.Core price={prices[1]}>
				<Card.Content class="flex flex-col gap-6">
					<Price.Amount price={prices[1]} />
					<Price.Button price={prices[1]}>Select Expedited</Price.Button>
				</Card.Content>
			</Price.Core>
			<Card.Footer>
				<Pricing.PlanFeatures>
					<Pricing.FeatureItem icon={CheckCircleIcon} iconClass="text-muted-foreground">
						All Standard Service Features
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={ClockIcon} iconClass="text-amber-500">
						Accelerated Delivery: Within 10 business days
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={TrendingUpIcon} iconClass="text-green-600">
						Priority case handling
					</Pricing.FeatureItem>
				</Pricing.PlanFeatures>
			</Card.Footer>
		</Card.Root>
	</Pricing.Plan>
	<Pricing.Plan>
		<Card.Root class="relative">
			<div class="absolute right-2 top-1.5">
				<Price.Badges price={prices[2]} />
			</div>
			<Card.Header>
				<Card.Title>{prices[2].product.name}</Card.Title>
				<Card.Description>
					{prices[2].product.description ?? ''}
				</Card.Description>
			</Card.Header>
			<Price.Core price={prices[2]}>
				<Card.Content class="flex flex-col gap-6">
					<Price.Amount price={prices[2]} />
					<Price.Button price={prices[2]}>Select Express</Price.Button>
				</Card.Content>
			</Price.Core>
			<Card.Footer>
				<Pricing.PlanFeatures>
					<Pricing.FeatureItem icon={CheckCircleIcon} iconClass="text-muted-foreground">
						All Standard Service Features
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={ZapIcon} iconClass="text-red-600">
						Urgent Delivery: Within 2 business days
					</Pricing.FeatureItem>
					<Pricing.FeatureItem icon={AlertOctagonIcon} iconClass="text-green-600">
						Top priority for critical deadlines
					</Pricing.FeatureItem>
				</Pricing.PlanFeatures>
			</Card.Footer>
		</Card.Root>
	</Pricing.Plan>
</Pricing.Root>
