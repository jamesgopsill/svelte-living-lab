<script lang="ts">
	import {
		Button,
		ButtonGroup,
		Input,
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
	let { name, gcode, id, connected, messages, state, estimatedPrintTime } =
		jobAgent
	let files: any
	let fileInput: any

	const connect = (): void => {
		if (!$bamAccessKey || !$bamGroup || !$bamBrokerURL) {
			alert("BAM Connection Settings Missing")
			return
		}
		jobAgent.connect()
	}

	$: {
		if (files) {
			const reader = new FileReader()
			reader.onload = function (event) {
				//@ts-ignore
				let g: string = event.target.result
				// analyse code for printer types
				if (g.includes("Ultimaker 3 Extended")) {
					// assuming cura
					const re = new RegExp(";TIME_ELAPSED:([0-9.]+)", "g")
					const matches = [...g.matchAll(re)]
					const time = parseFloat(matches.pop()[1])
					if (time) estimatedPrintTime.set(time)
					gcode.update((v) => {
						v[MachineTypes.UM3E] = g
						return v
					})
				}
				if (g.includes("PRINTER_MODEL_MINI")) {
					// Assuming prusaslicer
					// ; estimated printing time (normal mode) = 20m 29s
					// TODO: update for hours and days
					const re = new RegExp(
						"; estimated printing time \\(normal mode\\) = ([0-9]+)m ([0-9]+)s",
						"g"
					)
					const matches = [...g.matchAll(re)]
					const time =
						parseFloat(matches[0][1]) * 60 + parseFloat(matches[0][2])
					if (time) estimatedPrintTime.set(time)
					gcode.update((v) => {
						v[MachineTypes.PRUSA_MINI] = g
						return v
					})
				}
				if (g.includes("Ultimaker S3")) {
					// assuming cura
					const re = new RegExp(";TIME_ELAPSED:([0-9.]+)", "g")
					const matches = [...g.matchAll(re)]
					const time = parseFloat(matches.pop()[1])
					if (time) estimatedPrintTime.set(time)
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

		<ButtonGroup class="mt-3">
			<Button
				size="sm"
				color="primary"
				disabled={$connected}
				on:click={connect}
			>
				Connect and Submit
			</Button>
			<Button
				size="sm"
				color="danger"
				disabled={!$connected}
				on:click={() => jobAgent.disconnect()}
			>
				Disconnect
			</Button>
		</ButtonGroup>

		<hr />

		<small class="text-muted">
			<ul>
				<li>Estimated Print Time: {$estimatedPrintTime}</li>
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
		<small>
			<ol>
				{#each $messages as msg}
					<li>{msg}</li>
				{/each}
			</ol>
		</small>
	</Col>
</Row>
