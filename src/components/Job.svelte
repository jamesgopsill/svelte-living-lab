<script lang="ts">
	import {
		Button,
		FormGroup,
		Input,
		ListGroup,
		ListGroupItem,
		Row,
		Col,
		Badge,
		InputGroup,
		InputGroupText,
	} from "sveltestrap"
	import { MachineTypes } from "../definitions/enums"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "../stores/settings"
	import { JobAgent } from "../classes/job-agent"

	let jobAgent = new JobAgent()
	let { name, gcode, id, connected, messages, state } = jobAgent
	let files: any
	let fileInput: any

	const connect = (): void => {
		if (!$bamAccessKey || !$bamGroup || !$bamBrokerURL) {
			console.log("Information Missing")
			return
		}
		jobAgent.connect($bamBrokerURL, $bamAccessKey, $bamGroup)
	}

	$: {
		if (files) {
			const reader = new FileReader()
			reader.onload = function (event) {
				//@ts-ignore
				let g: string = event.target.result
				// analyse code for printer types
				if (g.includes("Ultimaker 3 Extended")) {
					gcode.update((v) => {
						v[MachineTypes.UM3E] = g
						return v
					})
				}
				if (g.includes("PRINTER_MODEL_MINI")) {
					gcode.update((v) => {
						v[MachineTypes.PRUSA_MINI] = g
						return v
					})
				}
				if (g.includes("Ultimaker S3")) {
					gcode.update((v) => {
						v[MachineTypes.UMS3] = g
						return v
					})
				}
				// For testing. place the gcode for the dummy printer to pick up
				gcode.update((v) => {
					v[MachineTypes.DUMMY] = g
					return v
				})
				fileInput.value = ""
			}
			reader.readAsText(files[0])
		}
	}
</script>

<Row>
	<Col sm="12" md="6" class="mt-4">
		<h5>Submit Job</h5>

		<InputGroup class="mb-1" size="sm">
			<InputGroupText>Job Name</InputGroupText>
			<Input
				placeholder="Job Name"
				bind:value={$name}
				invalid={!$name}
				feedback="Job Name Required"
			/>
		</InputGroup>

		<p class="mt-1 mb-1">Add Gcode File(s)</p>
		<InputGroup class="mb-1" size="sm">
			<input
				class="form-control"
				type="file"
				bind:files
				bind:this={fileInput}
			/>
		</InputGroup>
		<div class="mt-1 mb-1">
			{#each Object.entries($gcode) as [m, g]}
				{#if g}
					<Badge color="primary">{m}</Badge>
				{:else}
					<Badge color="warning">{m}</Badge>
				{/if}
				&nbsp;
			{/each}
		</div>

		<FormGroup class="mt-3">
			<Button size="sm" color="primary" disabled={false} on:click={connect}>
				Connect and Submit
			</Button>
			<Button
				size="sm"
				color="danger"
				disabled={false}
				on:click={() => jobAgent.disconnect()}
			>
				Disconnect
			</Button>
		</FormGroup>

		<hr />

		<small class="text-muted">
			<ul>
				<li>Connecting to: {$bamBrokerURL}</li>
				<li>Group: {$bamGroup}</li>
				<li>
					Connection Status: {$connected}
				</li>
				<li>
					Connection Id: {$id}
				</li>
				<li>Job Status: {$state}</li>
			</ul>
		</small>
	</Col>

	<Col sm="12" md="6" class="mt-4">
		<h5>Log</h5>
		<ListGroup>
			{#each $messages as msg}
				<ListGroupItem><small>{msg}</small></ListGroupItem>
			{/each}
		</ListGroup>
	</Col>
</Row>