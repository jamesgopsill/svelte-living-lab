<script lang="ts">
	import { MachineTypes } from "../enums"
	import {
		FormGroup,
		InputGroup,
		InputGroupText,
		Input,
		Button,
	} from "sveltestrap"
	import machine from "../stores/machine-store"

	const download = () => {
		console.log("download print file")
		const file = new File([$machine.currentJob.gcode], "print.gcode", {
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

		$machine.currentJob.gcode = ""
	}

	$: {
		if ($machine.currentJob.gcode) {
			// If machine code is available
			$machine.available = false
		}
	}
</script>

<h2>Manual Printer</h2>

<FormGroup>
	<InputGroup>
		<InputGroupText>Select your machine.</InputGroupText>
		<Input type="select" name="select" bind:value={$machine.machineType}>
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
		bind:checked={$machine.available}
		type="switch"
		label="Toggle to make available to network"
	/>
</FormGroup>

<FormGroup>
	<InputGroup>
		<InputGroupText
			>Job status for transaction {$machine.currentJob
				.transactionId}.</InputGroupText
		>
		<Input type="select" name="select" bind:value={$machine.currentJob.status}>
			<option value="Queued">Queued</option>
			<option value="Printing">Printing</option>
			<option value="Complete">Complete</option>
			<option value="Failed">Failed</option>
		</Input>
	</InputGroup>
</FormGroup>

{#if $machine.currentJob.gcode}
	<p>A job has been received.</p>
	<Button on:click={download}>Download Gcode File</Button>
{/if}
