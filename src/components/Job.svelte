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

<!--

		/*
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import {
		MachineTypes,
		SocketEvents,
		JobStates,
		MessageSubjects,
	} from "../definitions/enums"
	import type { AllMessage, DirectMessage } from "../definitions/interfaces"
	*/

let name = ""
// Set entries for all the different gcode
let gcodes = {}
for (const machineType in MachineTypes) {
	gcodes[machineType] = ""
}
let status = JobStates.NOT_ONLINE
let isConnectDisabled = true
let isDisconnectDisabled = true
let files: any
let fileInput: any
let socket: Socket
let notifications: string[] = []

const connect = (): void => {
	console.log("Connecting to BAM")
	// TODO - all form checks
	if (!$bamAccessKey || !$bamGroup || !name) {
		console.log("Information Missing")
		return
	}
	let isThereGCode = false
	for (const [_, value] of Object.entries(gcodes)) {
		if (value) isThereGCode = true
	}
	if (!isThereGCode) {
		console.log("No gcode present")
		return
	}

	notify(`${new Date().toISOString()}: Connecting to BAM`)

	// Creating the connection
	const ioConfig = {
		auth: {
			token: $bamAccessKey,
		},
		extraHeaders: {
			"agent-type": "job",
			"group-key": $bamGroup,
		},
		path: "/socket/",
	}
	socket = io($bamBrokerURL, ioConfig)
		.on(SocketEvents.CONNECT, handleConnect)
		.on(SocketEvents.ALL_JOBS, handleAllJobs)
		.on(SocketEvents.DIRECT, handleDirect)
		.on(SocketEvents.MESSAGE_ERROR, (msg: string) => console.log(msg))
		.on(SocketEvents.CONNECT_ERROR, handleConnectionError)
}

const disconnect = () => {
	socket.close()
	isConnectDisabled = false
	isDisconnectDisabled = true
	socket = undefined
}

const handleConnect = function (this: Socket): void {
	isConnectDisabled = true
	isDisconnectDisabled = false
	status = JobStates.AVAILABLE
	socket = this
}

const handleConnectionError = function (this: Socket, err: Error): void {
	console.log(`Connection Error: ${err}`)
	isConnectDisabled = false
	isDisconnectDisabled = true
	this.close()
	socket = undefined
}

const handleAllJobs = function (this: Socket, msg: AllMessage): void {
	notify(
		`${new Date().toISOString()}: received ALL_JOBS message. I am ${status}`
	)
	// Respond to the machine
	if (
		msg.subject == MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS &&
		status == JobStates.AVAILABLE &&
		gcodes[msg.body.machineType]
	) {
		const response: DirectMessage = {
			to: msg.from,
			from: this.id,
			subject: MessageSubjects.JOB_IS_AVAILABLE,
			body: {},
			extra: {},
		}
		socket.emit(SocketEvents.DIRECT, response)
	}
}

const handleDirect = async function (
	this: Socket,
	msg: DirectMessage
): Promise<void> {
	notify(`${new Date().toISOString()}: Job received DIRECT message`)
	if (
		msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB &&
		status == JobStates.AVAILABLE
	) {
		notify(`${new Date().toISOString()}: Job responding with accept`)

		if (gcodes[msg.body.machineType]) {
			const response: DirectMessage = {
				to: msg.from,
				from: socket.id,
				subject: MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER,
				body: {
					gcode: gcodes[msg.body.machineType],
				},
				extra: {},
			}
			console.log(response)
			socket.emit(SocketEvents.DIRECT, response)
			status = JobStates.SELECTED
			notify(`${new Date().toISOString()}: Job has been accepted`)
		} else {
			notify(`${new Date().toISOString()}: Job responding with decline`)
			const response: DirectMessage = {
				to: msg.from,
				from: this.id,
				subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
				body: {},
				extra: {},
			}
			socket.emit(SocketEvents.DIRECT, response)
		}
		return
	}
	if (msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB) {
		notify(`${new Date().toISOString()}: Job responding with decline`)
		const response: DirectMessage = {
			to: msg.from,
			from: this.id,
			subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
			body: {},
			extra: {},
		}
		socket.emit(SocketEvents.DIRECT, response)
		return
	}
	if (msg.subject == MessageSubjects.CONTRACT_ID) {
		notify(`${new Date().toISOString()}: Contracts ID ${msg.body.id}`)
		return
	}
}

const notify = (msg: string) => {
	console.log(msg)
	notifications.push(msg)
	notifications = notifications
}

$: {
	if (files) {
		const reader = new FileReader()
		reader.onload = function (event) {
			//@ts-ignore
			let g: string = event.target.result
			// analyse code for printer types
			if (g.includes("Ultimaker 3 Extended")) {
				gcodes[MachineTypes.UM3E] = g
			}
			if (g.includes("PRINTER_MODEL_MINI")) {
				gcodes[MachineTypes.PRUSA_MINI] = g
			}
			if (g.includes("Ultimaker S3")) {
				gcodes[MachineTypes.UMS3] = g
			}
			// For testing. place the gcode for the dummy printer to pick up
			gcodes[MachineTypes.DUMMY] = g
			fileInput.value = ""
		}
		reader.readAsText(files[0])
	}
}

$: {
	if (
		name &&
		$bamAccessKey &&
		$bamGroup &&
		$bamBrokerURL &&
		status == JobStates.NOT_ONLINE
	) {
		isConnectDisabled = false
	} else {
		isConnectDisabled = true
	}
}

$: {
	if (socket) {
		isDisconnectDisabled = false
	} else {
		isDisconnectDisabled = true
	}
}

-->
