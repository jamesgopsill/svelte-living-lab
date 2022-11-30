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
		Table
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
						gcode: gcodes[msg.body.machineType]
					}
				}
				console.log(response)
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
		if (msg.subject == MessageSubjects.TRANSACTION_ID) {
			notify(`${new Date().toISOString()}: Transaction ID ${msg.body.id}`)
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

		<h6 class="text-center">Job Form</h6>

		<Row>
			<Col xs="12">
				<FormGroup floating label="Job Name">
					<Input
						type="text"
						bind:value={name}
						invalid={!name}
					/>
					<!-- feedback="Job Name Required" -->
				</FormGroup>
			</Col>
			<Col xs="12">
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

		<h6 class="text-center">Summary</h6>

		<Table striped={true} hover={true} size="sm">
			<thead>
				<tr>
					<th>Item</th>
					<th>Details</th>	
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Job Name</td>
					<td>{name}</td>
				</tr>
				<tr>
					<td>Connecting to</td>
					<td>{$bamBrokerURL}</td>
				</tr>
				<tr>
					<td>Group</td>
					<td>{$bamGroup}</td>
				</tr>
				<tr>
					<td>Job Status</td>
					<td>{status}</td>
				</tr>
				<tr>
					<td>Connection Status</td>
					<td>
						{#if socket}
							{socket.connected}
						{/if}
					</td>
				</tr>
				<tr>
					<td>Connection Id</td>
					<td>
						{#if socket}
							{socket.id}
						{/if}
					</td>
				</tr>
				<tr>
					<td>Gcode</td>
					<td>
						{#each Object.entries(gcodes) as [m, g]}
							{#if g}
								<Badge color="primary">{m}</Badge>
							{:else}
								<Badge color="warning">{m}</Badge>
							{/if}
							&nbsp;
						{/each}
					</td>
				</tr>
			</tbody>
		</Table>

		<FormGroup>
			<Button
				color="primary"
				bind:disabled={isConnectDisabled}
				on:click={connect}
			>
				Connect and Submit
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
		<h6 class="text-center">Messages</h6>
		<ListGroup>
			{#each notifications as noti}
				<ListGroupItem><small>{noti}</small></ListGroupItem>
			{/each}
		</ListGroup>
	</Col>
</Row>
