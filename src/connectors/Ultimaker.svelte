<script lang="ts">
	import { FormGroup, Input, Row, Col, Button } from "sveltestrap"
	import {
		UltimakerClient,
		UltimakerJobTargetState,
	} from "@jamesgopsill/ultimaker-client"
	import machine from "../stores/machine-store"

	let ip = ""
	let connect = false
	let client: UltimakerClient = null
	let interval: any = null
	let name = "-"
	let status = "-"
	let bedTemp = {
		current: 0.0,
		target: 0.0,
	}
	let files: any

	const getSystemDetails = async () => {
		const system = await client.getSystem()
		name = system.name
	}

	const submitGcode = () => {
		if (files && client) {
			const reader = new FileReader()
			reader.onload = function (event) {
				//@ts-ignore
				let g: string = event.target.result
				client.postJob("bam", g)
				files = null
			}
			reader.readAsText(files[0])
		}
	}

	const cancel = () => {
		if (client) {
			client.putJobState(UltimakerJobTargetState.ABORT)
		}
	}

	$: if (connect && !client) {
		console.log("|- Connecting to Ultimaker")
		client = new UltimakerClient(ip)
		getSystemDetails()
		interval = setInterval(async () => {
			bedTemp = await client.getPrinterBedTemperature()
			status = await client.getPrinterStatus()
		}, 1000)
	}

	$: if (!connect && client) {
		client = null
		name = "-"
		status = "-"
		bedTemp = {
			current: 0.0,
			target: 0.0,
		}
		clearInterval(interval)
	}

	$: if ($machine.gcode && client) {
		$machine.available = false
		client.postJob("bam", $machine.gcode).then(() => {
			$machine.gcode = ""
		})
	}
</script>

<hr />

<h5>Ultimaker</h5>

<dl class="row">
	<dt class="col-3">Machine Name:</dt>
	<dd class="col-3">{name}</dd>
	<dt class="col-3">Machine Status:</dt>
	<dd class="col-3">{status}</dd>
	<dt class="col-3">Bed Temperature:</dt>
	<dd class="col-3">{bedTemp.current} ({bedTemp.target})</dd>
</dl>

<FormGroup floating label="IP Address">
	<Input
		type="text"
		bind:value={ip}
		invalid={!ip}
		feedback="IP Address Required"
	/>
</FormGroup>

<FormGroup>
	<Input
		bind:checked={connect}
		type="switch"
		label="Toggle to connect/disconnect printer"
	/>
	<Input
		bind:checked={$machine.available}
		type="switch"
		label="Toggle to make available to network"
	/>
</FormGroup>

<hr />

<h5>Controls</h5>

<Row>
	<Col>
		<FormGroup>
			<input class="form-control" type="file" bind:files />
		</FormGroup>
	</Col>
	<Col>
		<FormGroup>
			<Button color="primary" on:click={submitGcode}>Submit G-Code</Button>
			<Button color="danger" on:click={cancel}>Cancel Print</Button>
		</FormGroup>
	</Col>
</Row>
