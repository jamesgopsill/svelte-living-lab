<script lang="ts">
	import MachineAgent from "./MachineAgent.svelte"
	import {
		Input,
		InputGroup,
		InputGroupText,
		Row,
		Col,
		Button,
	} from "sveltestrap"
	import {
		MachineConnectionTypes,
		MachineJobStates,
		MachineStates,
		MachineTypes,
	} from "../definitions/enums"
	import Dummy from "./connectors/Dummy.svelte"
	import ManualPrinter from "./connectors/ManualPrinter.svelte"
	import Octoprint from "./connectors/Octoprint.svelte"
	import Ultimaker from "./connectors/Ultimaker.svelte"
	import WebSerialPrusaMini from "./connectors/WebSerialPrusaMini.svelte"

	let gcode: string = ""
	let jobStatus: MachineJobStates = MachineJobStates.NULL
	let contractId: string = ""
	let machineStatus: MachineStates = MachineStates.OFFLINE
	let machineAvailable: boolean = false

	let machineType: MachineTypes = MachineTypes.DUMMY
	let connectionType: MachineConnectionTypes = MachineConnectionTypes.DUMMY
	let machineConnectionCombo: string = "4"

	const resetStates = () => {
		gcode = ""
		jobStatus = MachineJobStates.NULL
		machineStatus = MachineStates.OFFLINE
	}

	$: {
		switch (machineConnectionCombo) {
			case "1":
				machineType = MachineTypes.PRUSA_MINI
				connectionType = MachineConnectionTypes.OCTOPRINT
				resetStates()
				break
			case "2":
				machineType = MachineTypes.UM3E
				connectionType = MachineConnectionTypes.ULTIMAKER_API
				resetStates()
				break
			case "3":
				machineType = MachineTypes.UMS3
				connectionType = MachineConnectionTypes.ULTIMAKER_API
				resetStates()
				break
			case "4":
				machineType = MachineTypes.PRUSA_MINI
				connectionType = MachineConnectionTypes.USB
				resetStates()
				break
			case "5":
				machineType = MachineTypes.PRUSA_MINI
				connectionType = MachineConnectionTypes.MANUAL
				resetStates()
				break
			case "6":
				machineType = MachineTypes.DUMMY
				connectionType = MachineConnectionTypes.MANUAL
				resetStates()
				break
			default:
				break
		}
	}
</script>

<Row class="mt-4">
	<Col xs={8}>
		<InputGroup size="sm" class="mb-2">
			<InputGroupText>Machine/Conn</InputGroupText>
			<Input type="select" name="select" bind:value={machineConnectionCombo}>
				<option value="1">Octoprint</option>
				<option value="2">Ultimaker 3 Extended & Ultimaker API </option>
				<option value="3">Ultimaker S3 & Ultimaker API </option>
				<option value="4">Prusa Mini & WebUSB</option>
				<option value="5">Manual</option>
				<option value="6">Dummy Printer</option>
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

<h5>Connect Machine</h5>

<small class="text-muted">
	<ul class="list-inline">
		<li class="list-inline-item">| Machine Type: {machineType}</li>
		<li class="list-inline-item">| Machine Status: {machineStatus}</li>
		<li class="list-inline-item">
			| Machine Available: {machineAvailable}
		</li>
		<li class="list-inline-item">| Job Status: {jobStatus}</li>
		<li class="list-inline-item">| Contract Id: {contractId}</li>
	</ul>
</small>

{#if machineConnectionCombo == "1"}
	<Octoprint
		bind:machineAvailable
		bind:gcode
		bind:machineType
		bind:jobStatus
		bind:machineStatus
	/>
{:else if machineConnectionCombo == "6"}
	<Dummy bind:jobStatus bind:gcode bind:machineStatus bind:machineAvailable />
{:else if machineConnectionCombo == "2" || machineConnectionCombo == "3"}
	<Ultimaker
		bind:jobStatus
		bind:gcode
		bind:machineStatus
		bind:machineAvailable
	/>
{:else if machineConnectionCombo == "4"}
	<WebSerialPrusaMini bind:gcode bind:machineAvailable />
{:else if machineConnectionCombo == "5"}
	<ManualPrinter
		bind:machineAvailable
		bind:gcode
		bind:machineType
		bind:jobStatus
		bind:machineStatus
	/>
{/if}
<h5 class="mt-3">Connect Machine to BAM</h5>
<MachineAgent
	bind:machineAvailable
	bind:gcode
	bind:machineType
	bind:contractId
	bind:jobStatus
/>
