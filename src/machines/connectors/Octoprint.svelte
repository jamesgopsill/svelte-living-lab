<script lang="ts">
	import {
		FormGroup,
		Input,
		InputGroup,
		InputGroupText,
		Button,
		Row,
		Col,
		Icon,
		Accordion,
		AccordionItem,
	} from "sveltestrap"
	import { OctoPrintClient, JobCommands } from "@jamesgopsill/octoprint-client"
	import type {
		PrinterStatus,
		JobInformation,
	} from "@jamesgopsill/octoprint-client"
	import {
		MachineJobStates,
		MachineStates,
		MachineTypes,
	} from "../../definitions/enums"

	export let jobStatus: MachineJobStates
	export let gcode: string
	export let machineStatus: MachineStates
	export let machineAvailable: boolean
	export let machineType: MachineTypes

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

	$: if (gcode) {
		machineAvailable = false
		client.uploadGcode("local", "bam.gcode", gcode).then(() => {
			console.log("gcode uploaded")
			client.print("bam.gcode").then(() => {
				console.log("print command issued")
				gcode = ""
				machineStatus = MachineStates.PRINTING
				jobStatus = MachineJobStates.PRINTING
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
				client.uploadGcode("local", "bam.gcode", g).then(() => {
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

<small class="text-muted">
	<ul class="list-inline">
		<li class="list-inline-item">
			| Octoprint Status: {#if stats}
				{stats.state.text}
			{/if}
		</li>
		<li class="list-inline-item">
			| Bed Temperature: {#if stats}
				{stats.temperature.bed.actual} ({stats.temperature.bed.target})
			{/if}
		</li>
		<li class="list-inline-item">
			| Extruder Temperature: {#if stats}
				{stats.temperature.tool0.actual} ({stats.temperature.tool0.target})
			{/if}
		</li>
		<li class="list-inline-item">
			| Current Job: {#if jobInformation}
				{jobInformation.job.file.name}
			{/if}
		</li>
		<li class="list-inline-item">
			| Progess: {#if jobInformation}
				{jobInformation.progress.completion}
			{/if}
		</li>
	</ul>
</small>

<Accordion>
	<AccordionItem>
		<p class="m-0" slot="header">Octoprint Settings <Icon name="gear" /></p>
		<InputGroup size="sm" class="mb-3">
			<InputGroupText>Select your machine.</InputGroupText>
			<Input type="select" name="select" bind:value={machineType}>
				<option value={MachineTypes.PRUSA_MINI}>Prusa Mini</option>
				<option value={MachineTypes.PRUSA_MK3S}>Prusa MK3S</option>
				<option value={MachineTypes.UM3E}>Ultimaker 3 Extended</option>
				<option value={MachineTypes.UMS3}>Ultimaker S3</option>
				<option value={MachineTypes.DUMMY}>Dummy</option>
			</Input>
		</InputGroup>

		<InputGroup size="sm">
			<InputGroupText>Octoprint URL</InputGroupText>
			<Input
				type="text"
				bind:value={url}
				invalid={!url}
				feedback="URL Required"
			/>
		</InputGroup>

		<InputGroup size="sm">
			<InputGroupText>API Key</InputGroupText>
			<Input
				type="text"
				bind:value={token}
				invalid={!token}
				feedback="API Key Required"
			/>
		</InputGroup>
	</AccordionItem>
</Accordion>

<FormGroup class="mt-2">
	<Input
		bind:checked={connect}
		type="switch"
		label="Toggle to connect/disconnect printer"
	/>
	<Input
		bind:checked={machineAvailable}
		type="switch"
		label="Toggle to make available to network"
	/>
</FormGroup>

<FormGroup>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.home(["x", "y", "z"])
		}}><Icon name="house-fill" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.jog(-5, 0, 0, false)
			// client.jobCommand(["G91", "G1 X-5", "G90"])
		}}><Icon name="arrow-left" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.jog(0, 5, 0, false)
			// client.printerCommands(["G91", "G1 Y5", "G90"])
		}}><Icon name="arrow-up" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.jog(0, -5, 0, false)
			//client.printerCommands(["G91", "G1 Y-5", "G90"])
		}}><Icon name="arrow-down" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.jog(5, 0, 0, false)
			// client.printerCommands(["G91", "G1 X5", "G90"])
		}}><Icon name="arrow-right" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.jog(0, 0, 5, false)
			//if (client) client.printerCommands(["G91", "G1 Z5", "G90"])
		}}><Icon name="arrow-bar-up" /></Button
	>
	<Button
		size="sm"
		color="primary"
		on:click={() => {
			if (client) client.jog(0, 0, -5, false)
			// if (client) client.printerCommands(["G91", "G1 Z-5", "G90"])
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
		<Button size="sm" color="primary" on:click={submitGcode}
			>Submit G-Code</Button
		>
		<Button size="sm" color="danger" on:click={cancel}>Cancel Print</Button>
	</Col>
</Row>
