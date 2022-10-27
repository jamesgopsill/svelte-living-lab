<script lang="ts">
	import {
		Navbar,
		NavbarBrand,
		Container,
		TabContent,
		TabPane,
	} from "sveltestrap"
	import Job from "./Job.svelte"
	import Machine from "./Machine.svelte"
	import Settings from "./Settings.svelte"
	//@ts-ignore
	import logoUrl from "./assets/logo.png"
	import epsrcUrl from "./assets/epsrc.png"
</script>

<Navbar color="light" light={true} expand="md" class="mb-1">
	<NavbarBrand href="#">BAM Living Lab</NavbarBrand>
</Navbar>

<Container xxl>
	<p class="text-center">
			<img
				alt=""
				height="60"
				src={logoUrl}
			/>
			&nbsp;
			<img
				alt=""
				height="60"
				class="mt-2"
				src={epsrcUrl}
			/>
		</p>
	<TabContent>
		<TabPane class="mt-1" tabId="job" tab="Submit Job" active>
			<Job />
		</TabPane>
		<TabPane class="mt-1" tabId="machine" tab="Connect a Machine">
			<Machine />
		</TabPane>
		<TabPane class="mt-1" tabId="settings" tab="Settings">
			<Settings />
		</TabPane>
	</TabContent>
	<footer class="text-center"><hr/><p>👨‍💻 with 🧡 and ☕</p></footer>
</Container>
