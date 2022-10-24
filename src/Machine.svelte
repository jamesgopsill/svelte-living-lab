<script lang="ts">
	import {
		FormGroup,
		Input,
		InputGroup,
		InputGroupText,
		Row,
		Col,
	} from "sveltestrap"
	import { MachineConnectionTypes, MachineTypes } from "./enums"
	import Dummy from "./connectors/Dummy.svelte"
	import machine from "./stores/machine-store"
	import MachineAgent from "./MachineAgent.svelte"
	import Octoprint from "./connectors/Octoprint.svelte"
	import Ultimaker from "./connectors/Ultimaker.svelte"
	import WebSerialPrusaMini from "./connectors/WebSerialPrusaMini.svelte"
	import WebSerialPrusaMK3S from "./connectors/WebSerialPrusaMK3S.svelte"

	const changeMachine = (event: any) => {
		console.log(event.target.value)
		switch (event.target.value) {
			case "1":
				console.log("test1")
				$machine.machineType = MachineTypes.UM3E
				$machine.connectionType = MachineConnectionTypes.ULTIMAKER_API
				break
			case "2":
				$machine.machineType = MachineTypes.UMS3
				$machine.connectionType = MachineConnectionTypes.ULTIMAKER_API
				break
			case "3":
				$machine.machineType = MachineTypes.PRUSA_MINI
				$machine.connectionType = MachineConnectionTypes.USB
				break
			case "4":
				$machine.machineType = MachineTypes.PRUSA_MINI
				$machine.connectionType = MachineConnectionTypes.OCTOPRINT
				break
			case "5":
				$machine.machineType = MachineTypes.PRUSA_MK3S
				$machine.connectionType = MachineConnectionTypes.USB
				break
			case "6":
				$machine.machineType = MachineTypes.DUMMY
				$machine.connectionType = MachineConnectionTypes.DUMMY
				break
			default:
				break
		}
	}
</script>

<br />

<Row>
	<Col xs={6}>
		<FormGroup>
			<InputGroup>
				<InputGroupText>Select the machine/connection type</InputGroupText>
				<Input type="select" name="select" on:change={changeMachine}>
					<option value="1">Ultimaker 3 Extended (Ultimaker API)</option>
					<option value="2">Ultimaker S3 (Ultimaker API)</option>
					<option value="3">Prusa Mini (WebUSB)</option>
					<option value="4">Prusa (Octoprint)</option>
					<option value="5">Prusa MK3S (WebUSB) [NOT COMPLETE]</option>
					<option value="6">Dummy Printer</option>
				</Input>
			</InputGroup>
		</FormGroup>
	</Col>
	<Col xs={6} class="text-center">
		<img
			alt=""
			height="50"
			src="https://dmf-lab.co.uk/wp-content/uploads/2021/05/Logo_with_uob_lowres.png"
		/>
		&nbsp;
		<img
			alt=""
			height="50"
			src="https://upload.wikimedia.org/wikipedia/commons/9/9c/UKRI_EPSR_Council-Logo_Horiz-RGB.png" 
		/>
	</Col>
</Row>

{#if $machine.connectionType == MachineConnectionTypes.ULTIMAKER_API}
	<Ultimaker />
	<hr />
	<MachineAgent />
{:else if $machine.connectionType == MachineConnectionTypes.USB && $machine.machineType == MachineTypes.PRUSA_MINI}
	<WebSerialPrusaMini />
	<hr />
	<MachineAgent />
{:else if $machine.connectionType == MachineConnectionTypes.USB && $machine.machineType == MachineTypes.PRUSA_MK3S}
	<WebSerialPrusaMK3S />
	<hr />
	<MachineAgent />
{:else if $machine.connectionType == MachineConnectionTypes.OCTOPRINT}
	<Octoprint />
	<hr />
	<MachineAgent />
{:else if $machine.connectionType == MachineConnectionTypes.DUMMY}
	<Dummy />
	<MachineAgent />
{/if}
