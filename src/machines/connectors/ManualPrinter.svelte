<script lang="ts">
	import { MachineJobStates, MachineTypes } from "../../definitions/enums"
	import {
		FormGroup,
		InputGroup,
		InputGroupText,
		Input,
		Button,
	} from "sveltestrap"
	import { machineAgent } from "../../classes/machine-agent"

	let { gcode, available, machineType, jobStatus } = machineAgent

	const download = () => {
		console.log("download print file")
		const file = new File([$gcode], "print.gcode", {
			type: "text/plain",
		})

		const link = document.createElement("a")
		const url = URL.createObjectURL(file)

		link.href = url
		link.download = file.name
		document.body.appendChild(link)
		link.click()

		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)

		gcode.set("")
		// machineStatus = MachineStates.PRINTING
	}

	$: {
		if ($gcode) {
			// If machine code is available
			available.set(false)
		}
	}
</script>

<FormGroup>
	<InputGroup size="sm">
		<InputGroupText>Select your machine.</InputGroupText>
		<Input type="select" name="select" bind:value={$machineType}>
			<option value={MachineTypes.PRUSA_MINI}>Prusa Mini</option>
			<option value={MachineTypes.PRUSA_MK3S}>Prusa MK3S</option>
			<option value={MachineTypes.UM3E}>Ultimaker 3 Extended</option>
			<option value={MachineTypes.UMS3}>Ultimaker S3</option>
			<option value={MachineTypes.DUMMY}>Dummy</option>
		</Input>
	</InputGroup>
</FormGroup>

<FormGroup>
	<Input
		bind:checked={$available}
		type="switch"
		label="Toggle to make available to network"
	/>
</FormGroup>

{#if $jobStatus == MachineJobStates.QUEUED || $jobStatus == MachineJobStates.PRINTING}
	<FormGroup>
		<InputGroup>
			<InputGroupText>Update Job Status</InputGroupText>
			<Input type="select" name="select" bind:value={$jobStatus}>
				<option value={MachineJobStates.QUEUED} disabled={true}>Queued</option>
				<option value={MachineJobStates.PRINTING}>Printing</option>
				<option value={MachineJobStates.COMPLETE}>Complete</option>
			</Input>
		</InputGroup>
	</FormGroup>
{/if}

{#if $gcode}
	<p>A job has been received.</p>
	<Button on:click={download}>Download Gcode File</Button>
{/if}
