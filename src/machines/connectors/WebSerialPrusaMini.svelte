<script lang="ts">
	import {
		FormGroup,
		Input,
		Button,
		Icon,
		Accordion,
		AccordionItem,
		InputGroup,
		InputGroupText,
		Row,
		Col,
	} from "sveltestrap"
	import { WebSerialPrinter } from "../../classes/web-serial-printer"
	import { machineAgent } from "../../classes/machine-agent"
	let { gcode, available } = machineAgent

	let files: any
	let printer = new WebSerialPrinter("PRUSA_MINI")
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

	$: if ($gcode) {
		available.set(false)
		const g = ("-" + $gcode).slice(1)
		printer.print(g)
		gcode.set("")
	}
</script>

<small class="text-muted">
	<ul class="list-inline mb-0">
		<li class="list-inline-item">| Firmware: {$firmware}</li>
		<li class="list-inline-item">| Source Code URL: {$sourceCodeUrl}</li>
		<li class="list-inline-item">| Status: {$status}</li>
		<li class="list-inline-item">| Protocol Version: {$protocolVersion}</li>
		<li class="list-inline-item">| UUID: {$uuid}</li>
		<li class="list-inline-item">| Machine Type: {$machineType}</li>
	</ul>
	<ul class="list-inline">
		<li class="list-inline-item">
			| Extruder Temp: {$extruderTempActual} ({$extruderTempDemand})
		</li>
		<li class="list-inline-item">
			| Bed Temp: {$bedTempActual} ({$bedTempDemand})
		</li>
	</ul>
</small>

<Accordion>
	<AccordionItem>
		<p class="m-0" slot="header">
			<small
				>WebUSB Settings (Chrome or Edge required) <Icon name="gear" /></small
			>
		</p>
		<InputGroup size="sm">
			<InputGroupText>URL</InputGroupText>
			<Input
				type="text"
				bind:value={printer.baud}
				invalid={!printer.baud}
				feedback="Baud Rate Required"
			/>
		</InputGroup>
	</AccordionItem>
</Accordion>

<FormGroup class="mt-2">
	<Input
		bind:checked={printer.isConnected}
		on:change={toggle}
		type="switch"
		label="Toggle switch to connect/disconnect printer"
	/>
	<Input
		bind:checked={$available}
		type="switch"
		label="Toggle to make available"
	/>
</FormGroup>

<FormGroup>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G28"])
		}}><Icon name="house-fill" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 X-5"])
		}}><Icon name="arrow-left" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Y5"])
		}}><Icon name="arrow-up" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Y-5"])
		}}><Icon name="arrow-down" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 X5"])
		}}><Icon name="arrow-right" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Z5"])
		}}><Icon name="arrow-bar-up" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (printer.writer) printer.sendGcode(["G91", "G1 Z-5"])
		}}><Icon name="arrow-bar-down" /></Button
	>
</FormGroup>

<Row>
	<Col>
		<InputGroup size="sm">
			<input class="form-control" type="file" bind:files />
		</InputGroup>
	</Col>
	<Col>
		<Button size="sm" color="primary" on:click={submit}>Submit G-Code</Button>
		<Button size="sm" color="danger" on:click={cancel}>Cancel Print</Button>
	</Col>
</Row>
