<script lang="ts">
	import {
		Button,
		FormGroup,
		Input,
		ListGroup,
		ListGroupItem,
		Row,
		Col,
	} from "sveltestrap"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import {
		MachineTypes,
		MessageProtocols,
		JobStates,
		MessageSubjects,
	} from "./enums"
	import type { Message } from "./interfaces"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "./stores/settings-store"

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
	let notifications: string[] = [`${new Date().toISOString()}: Welcome to BAM`]

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
		//const url = $bamBrokerURL // "https://www.workshop-jobs.com"
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
			.on(MessageProtocols.CONNECT, handleConnect)
			.on(MessageProtocols.ALL_JOBS, handleAllJobs)
			.on(MessageProtocols.DIRECT, handleDirect)
			.on(MessageProtocols.MESSAGE_ERROR, (msg: string) => console.log(msg))
			.on(MessageProtocols.CONNECT_ERROR, handleConnectionError)
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

	const handleConnectionError = function (this: Socket, err: string): void {
		console.log(`Connection Error: ${err}`)
		isConnectDisabled = false
		isDisconnectDisabled = true
		this.close()
		socket = undefined
	}

	const handleAllJobs = function (this: Socket, msg: Message): void {
		notify(
			`${new Date().toISOString()}: received ALL_JOBS message. I am ${status}`
		)
		// Respond to the machine
		if (
			msg.subject == MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS &&
			status == JobStates.AVAILABLE &&
			gcodes[msg.body.machineType]
		) {
			const response: Message = {
				toId: msg.fromId,
				fromId: socket.id,
				subject: MessageSubjects.JOB_IS_AVAILABLE,
				body: {},
			}
			socket.emit(MessageProtocols.DIRECT, response)
		}
	}

	const handleDirect = async function (
		this: Socket,
		msg: Message
	): Promise<void> {
		notify(`${new Date().toISOString()}: Job received DIRECT message`)
		if (
			msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB &&
			status == JobStates.AVAILABLE
		) {
			notify(`${new Date().toISOString()}: Job responding with accept`)

			if (gcodes[msg.body.machineType]) {
				const response: Message = {
					toId: msg.fromId,
					fromId: socket.id,
					subject: MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER,
					body: {
						gcode: gcodes[msg.body.machineType],
					},
				}
				socket.emit(MessageProtocols.DIRECT, response)
				status = JobStates.SELECTED
				notify(`${new Date().toISOString()}: Job has been accepted`)
			} else {
				notify(`${new Date().toISOString()}: Job responding with decline`)
				const response: Message = {
					toId: msg.fromId,
					fromId: socket.id,
					subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
					body: {},
				}
				socket.emit(MessageProtocols.DIRECT, response)
			}
			return
		}
		if (msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB) {
			notify(`${new Date().toISOString()}: Job responding with decline`)
			const response: Message = {
				toId: msg.fromId,
				fromId: socket.id,
				subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
				body: {},
			}
			socket.emit(MessageProtocols.DIRECT, response)
			return
		}
	}

	const notify = (msg: string) => {
		console.log(msg)
		notifications.push(msg)
		if (notifications.length > 6) notifications.shift()
		notifications = notifications
	}

	/*
	const removeNotification = (idx: number) => {
		notifications.splice(idx, 1)
		notifications = notifications
	}
	*/

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
</script>

<Row>
	<Col xs="8" class="mt-4">
		<Row>
			<Col xs="6">
				<FormGroup floating label="Job Name">
					<Input
						type="text"
						bind:value={name}
						invalid={!name}
						feedback="Job Name Required"
					/>
				</FormGroup>
			</Col>
			<Col xs="6">
				<FormGroup label="Add G-Code">
					<input
						class="form-control"
						type="file"
						bind:files
						bind:this={fileInput}
					/>
				</FormGroup>
			</Col>
		</Row>

		<h5>Details</h5>

		<dl class="row">
			<dt class="col-3">Connecting to:</dt>
			<dd class="col-9">{$bamBrokerURL}</dd>
			<!--
		<dt class="col-3">Access key:</dt>
		<dd class="col-9">{$bamAccessKey}</dd>
	-->
			<dt class="col-3">Group:</dt>
			<dd class="col-9">{$bamGroup}</dd>
			<dt class="col-3">Job Status:</dt>
			<dd class="col-9">{status}</dd>
			<dt class="col-3">Connection Status:</dt>
			<dd class="col-3">
				{#if socket}
					{socket.connected}
				{/if}
			</dd>
			<dt class="col-3">Connection Id:</dt>
			<dd class="col-3">
				{#if socket}
					{socket.id}
				{/if}
			</dd>
		</dl>

		<p><strong>Job G-Code</strong></p>
		<ListGroup>
			{#each Object.entries(gcodes) as [m, g]}
				{#if g}
					<ListGroupItem color="primary">{m}: True</ListGroupItem>
				{:else}
					<ListGroupItem color="warning">{m}: False</ListGroupItem>
				{/if}
			{/each}
		</ListGroup>

		<br />

		<FormGroup>
			<Button
				color="primary"
				bind:disabled={isConnectDisabled}
				on:click={connect}
			>
				Connect
			</Button>
			<Button
				color="danger"
				bind:disabled={isDisconnectDisabled}
				on:click={disconnect}
			>
				Disconnect
			</Button>
		</FormGroup>
	</Col>

	<Col xs="4" class="mt-4">
		<img
			alt=""
			width="100%"
			src="https://dmf-lab.co.uk/wp-content/uploads/2021/05/Logo_with_uob_lowres.png"
		/>

		<br /><br />

		<h5>Messages</h5>
		<ListGroup>
			{#each notifications as noti}
				<ListGroupItem><small>{noti}</small></ListGroupItem>
			{/each}
		</ListGroup>
	</Col>
</Row>
