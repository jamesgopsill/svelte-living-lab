<script lang="ts">
	import { FormGroup, Input, Label, Button } from "sveltestrap"
	import machine from "../stores/machine-store"
	import { WebSerialPrinter } from "../web-serial-printer"

	let files: any
	let printer = new WebSerialPrinter()
	printer.baud = 115200
	let { firmware, sourceCodeUrl, status, protocolVersion, uuid, machineType, extruderTempActual, extruderTempDemand, bedTempActual, bedTempDemand } = printer


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
			reader.onload = function(event) {
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

<h5>Prusa through WebUSB (Chrome or Edge required)</h5>

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
	<dt class="col-sm-3">Extruder Temp:</dt>
	<dd class="col-sm-3">{$extruderTempActual} | {$extruderTempDemand}</dd>
	<dt class="col-sm-3">Bed Temp:</dt>
	<dd class="col-sm-3">{$bedTempActual} | {$bedTempDemand}</dd>
</dl>

<FormGroup>
	<Label size="sm">Baud Rate</Label>
	<Input 
		type="text" 
		bind:value={printer.baud}
		invalid={!printer.baud} 
		feedback="Baud Rate Required"
	/>
</FormGroup>

<FormGroup>
	<Input bind:checked={printer.isConnected} on:change={toggle} type="switch" label="Toggle switch to connect/disconnect printer" />
	<Input bind:checked={$machine.available} type="switch" label="Toggle to make available" />
</FormGroup>

<FormGroup>
	<Label>Submit G-Code Directly</Label>
	<input class="form-control" type="file" bind:files />
</FormGroup>

<FormGroup>
	<Button color="primary" on:click={submit}>Submit</Button>
	<Button color="danger" on:click={cancel}>Cancel</Button>
</FormGroup>

