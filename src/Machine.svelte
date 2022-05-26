<script lang="ts">
	import { FormGroup, Input, InputGroup, InputGroupText } from "sveltestrap"
	import { MachineConnectionTypes, MachineTypes } from "./enums"
	import Dummy from "./connectors/Dummy.svelte"
	import machine from "./stores/machine-store"
	import MachineAgent from "./MachineAgent.svelte"
	import Octoprint from "./connectors/Octoprint.svelte"
	import Ultimaker from "./connectors/Ultimaker.svelte"
	import WebSerial from "./connectors/WebSerial.svelte"

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
				$machine.machineType = MachineTypes.DUMMY
				$machine.connectionType = MachineConnectionTypes.DUMMY
				break
			default:
				break
		}
	}
</script>

<br />

<FormGroup>
	<InputGroup>
		<InputGroupText>Select the machine/connection type</InputGroupText>
		<Input type="select" name="select" on:change={changeMachine}>
			<option value="1">Ultimaker 3 Extended (Ultimaker API)</option>
			<option value="2">Ultimaker S3 (Ultimaker API)</option>
			<option value="3">Prusa (WebUSB)</option>
			<option value="4">Prusa (Octoprint)</option>
			<option value="5">Dummy Printer</option>
		</Input>
	</InputGroup>
</FormGroup>

{#if $machine.connectionType == MachineConnectionTypes.ULTIMAKER_API}
	<Ultimaker />
	<hr />
	<MachineAgent />
{:else if $machine.connectionType == MachineConnectionTypes.USB}
	<WebSerial />
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
