<script lang="ts">
	import {
		Nav,
		Navbar,
		NavbarBrand,
		Container,
		TabContent,
		TabPane,
	} from "sveltestrap"
	import Job from "./Job.svelte"
	import Machine from "./Machine.svelte"
	import Settings from "./Settings.svelte"
</script>

<Navbar color="light" light={true} expand="md" class="mb-1">
	<NavbarBrand href="#">BAM Living Lab</NavbarBrand>
</Navbar>

<Container xxl>
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
</Container>
