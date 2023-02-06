<script lang="ts">
	import {
		FormGroup,
		Input,
		Row,
		Col,
		Button,
		Accordion,
		AccordionItem,
		Icon,
		InputGroupText,
		InputGroup,
	} from "sveltestrap"
	import {
		UltimakerClient,
		UltimakerJobTargetState,
	} from "@jamesgopsill/ultimaker-client"
	import { MachineJobStates, MachineTypes } from "../../definitions/enums"
	import { machineAgent } from "../../classes/machine-agent"

	let { gcode, available, jobStatus, machineType } = machineAgent

	let url = ""
	let connect = false
	let client: UltimakerClient | null = null
	let interval: any = null
	let name = "-"
	let status = "-"
	let bedTemp = {
		current: 0.0,
		target: 0.0,
	}
	let files: any

	const getSystemDetails = async () => {
		const r = await client.getSystem()
		if (r.ok) name = r.data.name
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
		client = new UltimakerClient(url)
		getSystemDetails()
		interval = setInterval(async () => {
			const r1 = await client.getPrinterBedTemperature()
			if (r1.ok) bedTemp = r1.data
			const r2 = await client.getPrinterStatus()
			if (r2.ok) status = r2.data
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
		// machineStatus = MachineStates.OFFLINE
		jobStatus.set(MachineJobStates.NULL)
		clearInterval(interval)
	}

	$: if ($gcode && client) {
		available.set(false)
		client.postJob("bam", $gcode).then(() => {
			gcode.set("")
			//machineStatus.set(MachineStates.PRINTING)
			jobStatus.set(MachineJobStates.PRINTING)
		})
	}
</script>

<small class="text-muted">
	<ul class="list-inline">
		<li class="list-inline-item">
			| Ultimaker Name: {name}
		</li>
		<li class="list-inline-item">
			| Ultimaker Status: {status}
		</li>
		<li class="list-inline-item">
			| Bed Temperature: {bedTemp.current} ({bedTemp.target})
		</li>
	</ul></small
>

<Accordion>
	<AccordionItem active>
		<p class="m-0" slot="header">
			<small> Ultimaker Settings <Icon name="gear" /></small>
		</p>
		<InputGroup size="sm" class="mb-3">
			<InputGroupText>Select your machine.</InputGroupText>
			<Input type="select" name="select" bind:value={$machineType}>
				<option value={MachineTypes.UM3E}>Ultimaker 3 Extended</option>
				<option value={MachineTypes.UMS3}>Ultimaker S3</option>
			</Input>
		</InputGroup>
		<InputGroup size="sm">
			<InputGroupText>URL</InputGroupText>
			<Input
				type="text"
				bind:value={url}
				invalid={!url}
				feedback="URL Required"
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
		bind:checked={$available}
		type="switch"
		label="Toggle to make available to network"
	/>
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
