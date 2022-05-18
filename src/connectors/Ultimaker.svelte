<script lang="ts">
	import { FormGroup, Label, Input } from "sveltestrap"
	import { UltimakerClient } from "@jamesgopsill/ultimaker-client"
	import machine from "../stores/machine-store"
	
	let ip = ""
	let connect = false
	let client: UltimakerClient = null
	let interval: any = null
	let name = ""
	let status = ""
	let bedTemp = {
		current: 0.0,
		target: 0.0
	}
	let files: any

	const getSystemDetails = async () => {
		const system = await client.getSystem()
		name = system.name
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
		name = ""
		status = ""
		bedTemp = {
			current: 0.0,
			target: 0.0
		}
		clearInterval(interval)
	}

	$: if (files && client) {
		const reader = new FileReader()
		reader.onload = function(event) {
			//@ts-ignore
			let g: string = event.target.result
			client.postJob("bam", g)
			files = null
		}
		reader.readAsText(files[0])
	}

	$: if ($machine.gcode && client) {
		$machine.available = false
		client.postJob("bam", $machine.gcode).then(() =>{
			$machine.gcode = ""
		})
	}


</script>

<hr />

<h5>Ultimaker</h5>

<dl class="row">
	<dt class="col-sm-4">Machine Name:</dt>
	<dd class="col-sm-8">{name}</dd>
	<dt class="col-sm-4">Machine Status:</dt>
	<dd class="col-sm-8">{status}</dd>
	<dt class="col-sm-4">Bed Temperature:</dt>
	<dd class="col-sm-8">{bedTemp.current} ({bedTemp.target})</dd>
</dl>

<FormGroup>
	<Label size="sm">IP Address</Label>
	<Input 
		type="text" 
		bind:value={ip}
		invalid={!ip} 
		feedback="IP Address Required"
	/>
</FormGroup>

<FormGroup>
	<Input bind:checked={connect} type="switch" label="Toggle to connect/disconnect printer" />
	<Input bind:checked={$machine.available} type="switch" label="Toggle to make available" />
</FormGroup>

<FormGroup>
	<Label>Submit G-Code Directly</Label>
	<input class="form-control" type="file" bind:files />
</FormGroup>

<hr />