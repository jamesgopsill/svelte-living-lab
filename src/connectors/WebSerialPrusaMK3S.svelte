<script lang="ts">
	import {
		FormGroup,
		Input,
		Label,
		Button,
		InputGroup,
		InputGroupText,
		Icon,
	} from "sveltestrap"
	import machine from "../stores/machine-store"
	import { WebSerialPrinter } from "../web-serial-printer"

	let files: any
	let printer = new WebSerialPrinter("PRUSA_MK3S")
	printer.baud = 115200
	let {
		firmware,
		sourceCodeUrl,
		status,
		protocolVersion,
		uuid,
		machineType,
		extruderTempActual,
		extruderTempDemand,
		bedTempActual,
		bedTempDemand,
	} = printer

	const toggle = () => {
		if (printer.isConnected) {
			printer.disconnect()
		} else {
			printer.connect()
		}
	}

	const submit = () => {
		if (files) {
			const reader = new FileReader()
			reader.onload = function (event) {
				//@ts-ignore
				let g: string = event.target.result
				printer.print(g)
			}
			reader.readAsText(files[0])
		}
	}

	const cancel = () => {
		printer.cancel = true
	}

	$: if ($machine.gcode) {
		$machine.available = false
		printer.print($machine.gcode)
		$machine.gcode = ""
	}
</script>

<h5>Prusa Mini through WebUSB (Chrome or Edge required)</h5>

<dl class="row">
	<dt class="col-sm-3">Firmware:</dt>
	<dd class="col-sm-3">{$firmware}</dd>
	<dt class="col-sm-3">Source Code URL:</dt>
	<dd class="col-sm-3">{$sourceCodeUrl}</dd>
	<dt class="col-sm-3">Status:</dt>
	<dd class="col-sm-3">{$status}</dd>
	<dt class="col-sm-3">Protocol Version:</dt>
	<dd class="col-sm-3">{$protocolVersion}</dd>
	<dt class="col-sm-3">UUID:</dt>
	<dd class="col-sm-3">{$uuid}</dd>
	<dt class="col-sm-3">Machine Type:</dt>
	<dd class="col-sm-3">{$machineType}</dd>
</dl>

<FormGroup>
	<InputGroup>
		<InputGroupText>Baud Rate</InputGroupText>
		<Input
			type="text"
			bind:value={printer.baud}
			invalid={!printer.baud}
			feedback="Baud Rate Required"
		/>
	</InputGroup>
</FormGroup>

<FormGroup>
	<Input
		bind:checked={printer.isConnected}
		on:change={toggle}
		type="switch"
		label="Toggle switch to connect/disconnect printer"
	/>
	<Input
		bind:checked={$machine.available}
		type="switch"
		label="Toggle to make available"
	/>
</FormGroup>

<h5>Controls</h5>

<FormGroup>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G28"])
		}}><Icon name="house-fill" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 X-5"])
		}}><Icon name="arrow-left" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Y5"])
		}}><Icon name="arrow-up" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Y-5"])
		}}><Icon name="arrow-down" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 X5"])
		}}><Icon name="arrow-right" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Z5"])
		}}><Icon name="arrow-bar-up" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Z-5"])
		}}><Icon name="arrow-bar-down" /></Button
	>
</FormGroup>

<FormGroup>
	<Label>Submit G-Code Directly</Label>
	<input class="form-control" type="file" bind:files />
</FormGroup>

<FormGroup>
	<Button color="primary" on:click={submit}>Submit</Button>
	<Button color="danger" on:click={cancel}>Cancel</Button>
</FormGroup>
