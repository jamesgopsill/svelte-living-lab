<script lang="ts">
	import MachineAgent from "./MachineAgent.svelte"
	import {
		Input,
		InputGroup,
		InputGroupText,
		Row,
		Col,
		Button,
		TabContent,
		TabPane,
	} from "sveltestrap"
	import {
		MachineConnectionTypes,
		MachineJobStates,
		MachineTypes,
	} from "../definitions/enums"
	import Dummy from "./connectors/Dummy.svelte"
	import ManualPrinter from "./connectors/ManualPrinter.svelte"
	import Octoprint from "./connectors/Octoprint.svelte"
	import Ultimaker from "./connectors/Ultimaker.svelte"
	import WebSerialPrusaMini from "./connectors/WebSerialPrusaMini.svelte"
	import { machineAgent } from "../classes/machine-agent"

	let { machineType, available, jobStatus, contractId } = machineAgent

	let connectionType: MachineConnectionTypes = MachineConnectionTypes.DUMMY
	let machineConnectionCombo: string = "1"

	const resetStates = () => {
		machineAgent.gcode.set("")
		machineAgent.jobStatus.set(MachineJobStates.NULL)
	}

	$: {
		switch (machineConnectionCombo) {
			case "1":
				machineType.set(MachineTypes.PRUSA_MINI)
				connectionType = MachineConnectionTypes.OCTOPRINT
				resetStates()
				break
			case "2":
				machineType.set(MachineTypes.UM3E)
				connectionType = MachineConnectionTypes.ULTIMAKER_API
				resetStates()
				break
			case "3":
				machineType.set(MachineTypes.PRUSA_MINI)
				connectionType = MachineConnectionTypes.USB
				resetStates()
				break
			case "4":
				machineType.set(MachineTypes.PRUSA_MINI)
				connectionType = MachineConnectionTypes.MANUAL
				resetStates()
				break
			case "5":
				machineType.set(MachineTypes.DUMMY)
				connectionType = MachineConnectionTypes.MANUAL
				resetStates()
				break
			default:
				break
		}
	}
</script>

<TabContent>
	<TabPane tabId="a" tab="Select Machine" active>
		<Row class="mt-4">
			<Col xs={8}>
				<InputGroup size="sm" class="mb-2">
					<InputGroupText>Connection</InputGroupText>
					<Input
						type="select"
						name="select"
						bind:value={machineConnectionCombo}
					>
						<option value="1">Octoprint</option>
						<option value="2">Ultimaker API</option>
						<option value="3">WebUSB (Prusa Mini)</option>
						<option value="4">Manual</option>
						<option value="5">Dummy Printer</option>
						<option value="" disabled>-- Coming Soon--</option>
						<option value="" disabled>Prusa MK3S & WebUSB</option>
						<option value="" disabled>Eiger.io Fleet Manager</option>
						<option value="" disabled>Ultimaker Digital Factory</option>
					</Input>
				</InputGroup>
			</Col>
			<Col xs={4}>
				<Button size="sm" color="primary" on:click={resetStates}
					>Reset Job State</Button
				>
			</Col>
		</Row>
		<small class="text-muted">
			<ul class="list-inline">
				<li class="list-inline-item">| Machine Type: {$machineType}</li>
				<li class="list-inline-item">| Machine Available: {$available}</li>
				<li class="list-inline-item">| Job Status: {$jobStatus}</li>
				<li class="list-inline-item">| Contract Id: {$contractId}</li>
			</ul>
		</small>

		<hr />

		{#if machineConnectionCombo == "1"}
			<Octoprint />
		{:else if machineConnectionCombo == "5"}
			<Dummy />
		{:else if machineConnectionCombo == "2"}
			<Ultimaker />
		{:else if machineConnectionCombo == "3"}
			<WebSerialPrusaMini />
		{:else if machineConnectionCombo == "4"}
			<ManualPrinter />
		{/if}
	</TabPane>
	<TabPane tabId="b" tab="Join BAM">
		<MachineAgent />
	</TabPane>
</TabContent>
