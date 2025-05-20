<script>
	import { onNavigate } from '$app/navigation';
	import PersonalMenu from '$lib/components/personal-menu.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import MenuIcon from 'virtual:icons/lucide/menu';
	import XIcon from 'virtual:icons/lucide/x';
	import '../../app.css';
	import { WebsiteName } from '../../config';
	import HomeButton from './components/HomeButton.svelte';
	import ThemeSwitchButton from './components/ThemeSwitchButton.svelte';

	const menuItems = {
		'/': 'Home',
		'/#services': 'Our Services',
		'/#about': 'About Us',
		// 'sample': 'Sample Report', // Placeholder, will need a page/section
		'/#testimonials': 'Testimonials',
		'/#pricing': 'Pricing',
		'/contact': 'Contact',
	};

	let menuOpen = false;
	onNavigate((_) => {
		menuOpen = false;
	});

	export let data;
</script>

<header class="sticky top-0 z-10 border-b border-border bg-card py-4">
	<div
		class="container grid grid-cols-2 flex-nowrap items-center justify-between sm:grid-cols-[auto,auto,auto]"
	>
		<HomeButton />
		<nav class="hidden sm:block">
			<ul class="hidden flex-wrap px-1 text-lg font-bold sm:flex">
				{#each Object.entries(menuItems) as [href, text]}
					<li class="md:mx-2">
						<Button variant="ghost" {href} class="text-base text-foreground">
							{text}
						</Button>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="hidden justify-self-end sm:flex sm:gap-4">
			{#if data.user}
				<Button href="/dashboard">Dashboard</Button>
			{:else}
				<Button href="/#contact">Request a Consultation</Button>
			{/if}
			<PersonalMenu user={data.user} />
		</div>

		<div class="justify-self-end sm:hidden">
			<Drawer.Root bind:open={menuOpen}>
				<Drawer.Trigger asChild let:builder>
					<Button variant="ghost" size="icon" builders={[builder]}>
						<span class="sr-only">Menu</span>
						<MenuIcon />
					</Button>
				</Drawer.Trigger>
				<Drawer.Content>
					<Drawer.Header class="flex justify-end py-0">
						<Drawer.Close asChild let:builder>
							<Button variant="ghost" size="icon" builders={[builder]}>
								<span class="sr-only">Close</span>
								<XIcon />
							</Button>
						</Drawer.Close>
					</Drawer.Header>
					<Collapsible.Root>
						<Collapsible.Trigger asChild let:builder>
							<div class="p-2">
								<Button
									variant="ghost"
									class="flex w-full flex-nowrap gap-2 text-base"
									builders={[builder]}
								>
									Switch theme
									<ChevronsUpDown class="size-4" />
								</Button>
							</div>
						</Collapsible.Trigger>
						<Collapsible.Content>
							<ul
								class="grid grid-cols-[auto,auto] items-center gap-x-2 p-2 pt-0"
							>
								<li class="col-span-2 grid grid-cols-subgrid">
									<ThemeSwitchButton
										mode="system"
										class="col-span-2 grid grid-cols-subgrid"
									/>
								</li>
								<li class="col-span-2 grid grid-cols-subgrid">
									<ThemeSwitchButton
										mode="light"
										class="col-span-2 grid grid-cols-subgrid"
									/>
								</li>
								<li class="col-span-2 grid grid-cols-subgrid">
									<ThemeSwitchButton
										mode="dark"
										class="col-span-2 grid grid-cols-subgrid"
									/>
								</li>
							</ul>
						</Collapsible.Content>
					</Collapsible.Root>
					<Separator />
					<nav class="[&_ul]:flex [&_ul]:flex-col [&_ul]:p-2">
						<ul>
							{#each Object.entries(menuItems) as [href, text]}
								<li>
									<Button {href} variant="ghost" class="w-full py-6 text-base">
										{text}
									</Button>
								</li>
							{/each}
						</ul>
						<Separator />
						<ul class="">
							{#if !data.user}
								<li>
									<Button
										href="/#contact"
										variant="ghost"
										class="w-full py-6 text-base"
									>
										Request a Consultation
									</Button>
								</li>
								<li>
									<Button
										href="/#pricing"
										variant="ghost"
										class="w-full py-6 text-base"
									>
										View Pricing
									</Button>
								</li>
							{:else}
								<li>
									<Button
										href="/dashboard"
										variant="ghost"
										class="w-full py-6 text-base"
									>
										Dashboard
									</Button>
								</li>
								<li>
									<Button
										href="/settings"
										variant="ghost"
										class="w-full py-6 text-base"
									>
										Settings
									</Button>
								</li>
								<li>
									<Button
										href="/log-out"
										variant="ghost"
										class="w-full py-6 text-base"
									>
										Log out
									</Button>
								</li>
							{/if}
						</ul>
					</nav>
				</Drawer.Content>
			</Drawer.Root>
		</div>
	</div>
</header>

<main class="container mx-auto bg-background p-8">
	<slot />
</main>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<footer class="border-t border-border bg-card py-6">
	<div class="container flex flex-col gap-12">
		<div class="flex flex-col flex-wrap gap-12 sm:flex-row">
			<div class="flex-[0.3]">
				<HomeButton />
			</div>
			<div
				class={cn(
					'grid flex-1 grid-cols-2 gap-8 p-4 sm:grid-cols-4',
					'[&_.col]:flex [&_.col]:flex-col [&_.col]:gap-3',
					'[&_.footer-title]:text-lg [&_.footer-title]:font-semibold [&_.footer-title]:text-primary',
					'[&_nav]:flex [&_nav]:flex-col [&_nav]:gap-3 [&_nav]:text-muted-foreground',
				)}
			>
				<div class="col">
					<span class="footer-title">Menu</span>
					<nav>
						{#each Object.entries(menuItems) as [href, text]}
							<Button
								{href}
								variant="link"
								class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
							>
								{text}
							</Button>
						{/each}
					</nav>
				</div>
				<div class="col">
					<span class="footer-title">Service</span>
					<nav>
						<Button
							href="/contact"
							variant="link"
							class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
						>
							Request a Consultation
						</Button>
						<Button
							href="/#pricing"
							variant="link"
							class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
						>
							Pricing
						</Button>
						<Button
							href="/#contract"
							variant="link"
							class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
						>
							Contract (Coming Soon)
						</Button>
					</nav>
				</div>
				<div class="col">
					<span class="footer-title">Links</span>
					<nav>
						<Button
							variant="link"
							class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
							href="https://www.optatherapy.com"
							target="_blank"
						>
							Orthopedic Physical Therapy Associates
						</Button>
						<Button
							variant="link"
							class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
							href="#"
						>
							OPTAdvising (Coming Soon)
						</Button>
						<Button
							variant="link"
							class="block h-auto p-0 text-start text-base font-normal text-muted-foreground"
							href="#"
						>
							LinkedIn (Coming Soon)
						</Button>
					</nav>
				</div>
			</div>
		</div>
		<p class="max-w-prose place-self-center text-center text-sm leading-6">
			&copy; {new Date().getFullYear()}
			{WebsiteName} created by <Button
				variant="link"
				href="https://lukerouleau.com"
				target="_blank"
				class="h-auto p-0 text-primary underline hover:no-underline"
				>Luke Rouleau</Button
			>
		</p>
	</div>
</footer>

<style>
	:root {
		scroll-behavior: smooth;
	}
</style>
