<script lang="ts">
	import {
		FormGroup,
		Input,
		Button,
		Row,
		Col,
		InputGroup,
		InputGroupText,
		Icon
	} from "sveltestrap"
	import { OctoPrintClient, JobCommands } from "@jamesgopsill/octoprint-client"
	import type { PrinterStatus, JobInformation } from "@jamesgopsill/octoprint-client"
	import machine from "../stores/machine-store"

	let url = "" // URL of Octopi
	let token = "" // API token
	let stats: PrinterStatus | null = null
	let jobInformation: JobInformation | null = null 
	let statsInterval: any
	let client: OctoPrintClient = null
	let connect = false
	let files: any

	$: if (connect && !client) {
		console.log("|- Connecting to Octoprint")
		client = new OctoPrintClient(url, token)
		statsInterval = setInterval(async () => {
			const statsResponse = await client.status()
			if (statsResponse.ok) {
				stats = statsResponse.data
			}
			const jobResponse = await client.jobInformation()
			if (jobResponse.ok) {
				jobInformation = jobResponse.data
			}
		}, 1000)
	}

	$: if (!connect && client) {
		console.log("|- Disconnecting from Octoprint")
		client = null
		clearInterval(statsInterval)
		stats = null
	}

	$: if ($machine.gcode) {
		$machine.available = false
		client.uploadFileToLocal("bam.gcode", $machine.gcode).then(() => {
			console.log("gcode uploaded")
			client.print("bam.gcode").then(() => {
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
				client.uploadFileToLocal("bam.gcode", g).then(() => {
					console.log("gcode uploaded")
					client.print("bam.gcode").then(() => {
						console.log("print command issued")
					})
				})
			}
			reader.readAsText(files[0])
		}
	}

	const cancel = () => {
		if (client) {
			client.jobCommand(JobCommands.CANCEL)
		}
	}
</script>

<h5>Summary</h5>

<hr />

<dl class="row">
	<dt class="col-3">Machine Status:</dt>
	<dd class="col-3">
		{#if stats}
			{stats.state.text}
		{/if}
	</dd>
	<dt class="col-3">Machine Available:</dt>
	<dd class="col-3">{$machine.available}</dd>
	<dt class="col-3">Bed Temperature:</dt>
	<dd class="col-3">
		{#if stats}
			{stats.temperature.bed.actual} ({stats.temperature.bed.target})
		{/if}
	</dd>
	<dt class="col-3">Extruder Temperature:</dt>
	<dd class="col-3">
		{#if stats}
			{stats.temperature.tool0.actual} ({stats.temperature.tool0.target})
		{/if}
	</dd>
	<dt class="col-3">Current Job:</dt>
	<dd class="col-3">
		{#if jobInformation}
			{jobInformation.job.file.name}
		{/if}
	</dd>
	<dt class="col-3">Progress:</dt>
	<dd class="col-3">
		{#if jobInformation}
			{jobInformation.progress.completion}
		{/if}
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
<FormGroup>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.homeAll()
		}}><Icon name="house-fill" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.printerCommands(["G91", "G1 X-5", "G90"])
		}}><Icon name="arrow-left" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.printerCommands(["G91", "G1 Y5", "G90"])
		}}><Icon name="arrow-up" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.printerCommands(["G91", "G1 Y-5", "G90"])
		}}><Icon name="arrow-down" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.printerCommands(["G91", "G1 X5", "G90"])
		}}><Icon name="arrow-right" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.printerCommands(["G91", "G1 Z5", "G90"])
		}}><Icon name="arrow-bar-up" /></Button
	>
	<Button
		color="primary"
		on:click={() => {
			if (client) client.printerCommands(["G91", "G1 Z-5", "G90"])
		}}><Icon name="arrow-bar-down" /></Button
	>
</FormGroup>

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
