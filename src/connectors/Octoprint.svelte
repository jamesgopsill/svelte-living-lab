<script lang="ts">
	import {
		FormGroup,
		Input,
		Button,
		Row,
		Col,
		InputGroup,
		InputGroupText,
	} from "sveltestrap"
	import { OctoPrintClient, JobCommands } from "octoprint-client"
	import machine from "../stores/machine-store"

	const defaultStats = () => {
		return {
			state: {
				text: "Not Connected",
			},
			temperature: {
				bed: {
					actual: 0.0,
					target: 0.0,
				},
				tool0: {
					actual: 0.0,
					target: 0.0,
				},
			},
		}
	}

	let url = "" // URL of Octopi
	let token = "" // API token
	let stats: any = defaultStats()
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
		stats = defaultStats()
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

	const submitGcode = () => {
		if (files) {
			const reader = new FileReader()
			reader.onload = function (event) {
				//@ts-ignore
				let g: string = event.target.result
				// Should put checks here.
				client.uploadFileToLocal(g).then(() => {
					console.log("gcode uploaded")
					client.selectFileAndPrint("octoprint-client.gcode").then(() => {
						console.log("print command issued")
					})
				})
			}
			reader.readAsText(files[0])
		}
	}

	const cancel = () => {
		if (client) {
			client.issueJobCommand(JobCommands.CANCEL)
		}
	}
</script>

<h5>Summary</h5>

<hr />

<dl class="row">
	<dt class="col-3">Machine Status:</dt>
	<dd class="col-3">{stats.state.text}</dd>
	<dt class="col-3">Machine Available:</dt>
	<dd class="col-3">{$machine.available}</dd>
	<dt class="col-3">Bed Temperature:</dt>
	<dd class="col-3">
		{stats.temperature.bed.actual} ({stats.temperature.bed.target})
	</dd>
	<dt class="col-3">Extruder Temperature:</dt>
	<dd class="col-3">
		{stats.temperature.tool0.actual} ({stats.temperature.tool0.target})
	</dd>
</dl>

<h5>Connect</h5>

<FormGroup>
	<InputGroup>
		<InputGroupText>URL</InputGroupText>
		<Input
			type="text"
			bind:value={url}
			invalid={!url}
			feedback="URL Required"
		/>
	</InputGroup>
</FormGroup>

<FormGroup>
	<InputGroup>
		<InputGroupText>API Key</InputGroupText>
		<Input
			type="text"
			bind:value={token}
			invalid={!token}
			feedback="API Key Required"
		/>
	</InputGroup>
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
