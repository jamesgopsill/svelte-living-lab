<script lang="ts">
	import { FormGroup, Label, Input } from "sveltestrap"
	import { MachineConnectionTypes, MachineTypes } from "./enums"
	import Dummy from "./connectors/Dummy.svelte"
	import machine from "./stores/machine-store"
	import MachineAgent from "./MachineAgent.svelte"

	const changeMachine = (event) => {
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

<FormGroup>
	<Label>Select the machine/connection type</Label>
	<Input type="select" name="select" on:change={changeMachine}>
		<option value="1">Ultimaker 3 Extended (Ultimaker API)</option>
		<option value="2">Ultimaker S3 (Ultimaker API)</option>
		<option value="3">Prusa (WebUSB)</option>
		<option value="4">Prusa (Octoprint)</option>
		<option value="5">Dummy Printer</option>
	</Input>
</FormGroup>

{#if $machine.connectionType == MachineConnectionTypes.ULTIMAKER_API}
	<p>Ultimaker API</p>
{:else if $machine.connectionType == MachineConnectionTypes.USB}
	USB
{:else if $machine.connectionType == MachineConnectionTypes.OCTOPRINT}
	OCTOPRINT
{:else if $machine.connectionType == MachineConnectionTypes.DUMMY}
	<Dummy />
	<MachineAgent />
{/if}

