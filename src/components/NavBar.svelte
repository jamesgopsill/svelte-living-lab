<script lang="ts">
	import {
		Navbar,
		NavbarBrand,
		NavbarToggler,
		Nav,
		NavItem,
		NavLink,
		Collapse,
		Icon,
	} from "sveltestrap"

	let isOpen = false

	const handleUpdate = (event: any) => {
		isOpen = event.detail.isOpen
	}
</script>

<Navbar color="light" light={true} expand="md" class="mb-1">
	<NavbarBrand href="#/">BAM Living Lab</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="#/job">Submit Job</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#/machine">Connect a Machine</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#/track">Track a Job</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#/settings"><Icon name="gear" /></NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>
