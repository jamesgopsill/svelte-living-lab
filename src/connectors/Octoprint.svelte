<script lang="ts">
	import { FormGroup, Label, Input } from "sveltestrap"
	import { OctoPrintClient } from "octoprint-client"
	import machine from "../stores/machine-store"

	let url = ""
	let token = ""
	let stats: any = {
		state: {
			text: ""
		},
		temperature: {
			bed: {
				actual: 0.0,
				target: 0.0,
			},
			tool0: {
				actual: 0.0,
				target: 0.0,
			}
		}
	}
	let statsInterval: any
	let client: OctoPrintClient = null
	let connect = false
	let files: any

	$: if (connect && !client) {
		console.log("|- Connecting to Octoprint")
		client = new OctoPrintClient(url, token)
		statsInterval = setInterval(async () => {
			stats = await client.getStatus()
		}, 1000)
	}

	$: if (!connect && client) {
		console.log("|- Disconnecting from Octoprint")
		client = null
		clearInterval(statsInterval)
		stats = {
			state: {
				text: ""
			},
			temperature: {
				bed: {
					actual: 0.0,
					target: 0.0,
				},
				tool0: {
					actual: 0.0,
					target: 0.0,
				}
			}
		}
	}

	$: if ($machine.gcode) {
		$machine.available = false
		client.uploadFileToLocal($machine.gcode).then(() => {
			console.log("gcode uploaded")
			client.selectFileAndPrint("octoprint-client.gcode").then(() => {
				console.log("print command issued")
				$machine.gcode = ""
			})
		})
		
	}

	$: if (files) {
		const reader = new FileReader()
		reader.onload = function(event) {
			//@ts-ignore
			let g: string = event.target.result
			files = null
			// Should put checks here.
			client.uploadFileToLocal(g).then(() => {
				console.log("gcode uploaded")
				client.selectFileAndPrint("octoprint-client.gcode").then(() => {
					console.log("print command issued")
				})
			})
		};
		reader.readAsText(files[0])
	}


</script>

<h4>Connect</h4>

<dl class="row">
	<dt class="col-sm-4">Machine Status:</dt>
	<dd class="col-sm-8">{stats.state.text}</dd>
	<dt class="col-sm-4">Bed Temperature:</dt>
	<dd class="col-sm-8">{stats.temperature.bed.actual} ({stats.temperature.bed.target})</dd>
	<dt class="col-sm-4">Extruder Temperature:</dt>
	<dd class="col-sm-8">{stats.temperature.tool0.actual} ({stats.temperature.tool0.target})</dd>
	<dt class="col-sm-4">Machine Available:</dt>
	<dd class="col-sm-8">{$machine.available}</dd>
</dl>

<FormGroup>
	<Label size="sm">URL</Label>
	<Input 
		type="text" 
		bind:value={url}
		invalid={!url} 
		feedback="URL Required"
	/>
</FormGroup>

<FormGroup>
	<Label size="sm">API Key</Label>
	<Input 
		type="text" 
		bind:value={token}
		invalid={!token} 
		feedback="API Key Required"
	/>
</FormGroup>

<FormGroup>
	<Input bind:checked={connect} type="switch" label="Toggle to connect to printer" />
	<Input bind:checked={$machine.available} type="switch" label="Toggle to make available" />
</FormGroup>

<FormGroup>
	<Label>Submit G-Code Directly</Label>
	<input class="form-control" type="file" bind:files />
</FormGroup>
  