<script lang="ts">
	import { Button, FormGroup, Input, Label, Icon } from "sveltestrap"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import { MachineTypes, MessageProtocols, JobStates, MessageSubjects } from "./enums"
	import type { Message } from "./interfaces"
import Machine from "./Machine.svelte";

	let token = ""
	let group = ""
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
	let socket: Socket
	let notifications: string[] = [`${new Date().toISOString()}: Welcome to BAM`]

	const connect = (): void => {
		console.log("Connecting to BAM")
		// TODO - all form checks
		if (!token || !group || !name) {
			console.log("Information Missing")
			return
		}
		let isThereGCode = false
		for (const [key, value] of Object.entries(gcodes) ) {
			if (value) isThereGCode = true
		}
		if (!isThereGCode) {
			console.log("No gcode present")
			return
		}

		notifications.push(`${new Date().toISOString()}: Connecting to BAM`)
		notifications = notifications

		// Creating the connection
		const url = "https://www.workshop-jobs.com"
		const ioConfig = {
			auth: {
				token: token,
			},
			extraHeaders: {
				"agent-type": "job",
				"group-key": group,
			},
			path: "/socket/",
		}
		socket = io(url, ioConfig)
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

	const handleConnect = function(this: Socket): void {
		isConnectDisabled = true
		isDisconnectDisabled = false
		status = JobStates.AVAILABLE
		socket = this
	}

	const handleConnectionError = function(this: Socket, err: string): void {
		console.log(`Connection Error: ${err}`)
		isConnectDisabled = false
		isDisconnectDisabled = true
		this.close()
		socket = undefined
	}

	const handleAllJobs = function(this: Socket, msg: Message): void {
		console.log("|- JobAgent: received ALL_JOBS message")
		console.log(`|- JobAgent: status - ${status}`)
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

	const handleDirect = async function(this: Socket, msg: Message): Promise<void> {
		console.log("|- Job received DIRECT message")
		if (
			msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB &&
			status == JobStates.AVAILABLE
		) {
			console.log("|- Job responding with accept")

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
				notifications.push(`${new Date().toISOString()}: Job has been accepted`)
				notifications = notifications
			} else {
				console.log("|- Job responding with decline")
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
			console.log("|- Job responding with decline")
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

	const removeNotification = (idx: number) => {
		notifications.splice(idx, 1)
		notifications = notifications
	}

	$: {
		if (files) {
			const reader = new FileReader()
			reader.onload = function(event) {
				//@ts-ignore
				let g: string = event.target.result
				// analyse code for printer types
				if (g.includes("Ultimaker 3 Extended")) {
					gcodes[MachineTypes.UM3E] = g
				}
				if (g.includes("PRINTER_MODEL_MINI")) {
					gcodes[MachineTypes.PRUSA_MINI] = g
				}
				// For testing. place the gcode for the dummy printer to pick up
				gcodes[MachineTypes.DUMMY] = g
			};
			reader.readAsText(files[0])
		}
	}

	$: {
		if (name && group && token && status == JobStates.NOT_ONLINE) {
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

<p>Messages</p>
<ul>
{#each notifications as noti, i}
	<li>{noti} | <a href={"#"} on:click={() => removeNotification(i)}>delete</a></li>
{/each}
</ul>

<FormGroup>
	<Label>Access Key</Label>
	<Input 
		type="text" 
		bind:value={token} 
		invalid={!token} 
		feedback="Access Key Required" 
	/>
</FormGroup>

<FormGroup>
	<Label>Group</Label>
	<Input 
		type="text" 
		bind:value={group}
		invalid={!group} 
		feedback="Group Required"
	/>
</FormGroup>

<FormGroup>
	<Label>Job Name</Label>
	<Input 
		type="text" 
		bind:value={name}
		invalid={!name} 
		feedback="Job Name Required" 
	/>
</FormGroup>

<FormGroup>
	<Label>G-Code</Label>
	<input class="form-control" type="file" bind:files />
</FormGroup>

<FormGroup>
	<Button 
		color="primary"
		bind:disabled={isConnectDisabled}
		on:click={connect}>
		Connect
	</Button>
	<Button
		color="danger" 
		bind:disabled={isDisconnectDisabled} 
		on:click={disconnect}>
		Disconnect
	</Button>
</FormGroup>

<hr />

<p>Details</p>

<dl class="row">
	<dt class="col-sm-3">Job Status:</dt>
	<dd class="col-sm-9">{status}</dd>
	<dt class="col-sm-3">Socket Status:</dt>
	<dd class="col-sm-9">
		{#if socket}
			{socket.connected}
		{/if}
	</dd>
	<dt class="col-sm-3">Socket Id:</dt>
	<dd class="col-sm-9">
		{#if socket}
			{socket.id}
		{/if}
	</dd>
	<dt class="col-sm-3">Machine G-Codes</dt>
	<dd class="col-sm-9">
		{#each Object.entries(gcodes) as [m, g]}
			{#if g}
				<li>{m}: True</li>
			{:else}
				<li>{m}: False</li>
			{/if}
		{/each}
	</dd>
</dl>

