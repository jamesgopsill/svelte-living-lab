<script lang="ts">
	import { FormGroup, Label, Input, Button } from "sveltestrap"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import { MessageProtocols, MessageSubjects } from "./enums"
	import type { Message } from "./interfaces"
	import machine from "./stores/machine-store"

	let token = ""
	let group = ""
	let socket: Socket
	let isConnected = false
	let interval: any
	let jobs = []

	const connect = () => {

		if (!token || !group) {
			return
		}

		const url = "https://www.workshop-jobs.com"
		const ioConfig = {
			auth: {
				token: token,
			},
			extraHeaders: {
				"agent-type": "machine",
				"group-key": group,
			},
			path: "/socket/",
		}
		socket = io(url, ioConfig)
			.on(MessageProtocols.CONNECT, handleConnect)
			.on(MessageProtocols.DIRECT, handleDirect)
			.on(MessageProtocols.MESSAGE_ERROR, (msg: string) => console.log(msg))
			.on(MessageProtocols.CONNECT_ERROR, handleConnectionError)
	}

	const disconnect = () => {
		socket.close()
		isConnected = false
		socket = undefined
		clearInterval(interval)
	}

	const handleConnect = function(this: Socket) {
		console.log("Handling Connect")
		isConnected = true
		socket = this
		// Setting up the interval for looking for a job
		interval = setInterval(() => {
			console.log(`|- MachineAgent: loop, Available: ${$machine.available}`)
			if ($machine.available) {
				const msg: Message = {
				fromId: socket.id,
				toId: "",
				subject: MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS,
					body: {
						machineType: $machine.machineType,
					},
				}
				socket.emit(MessageProtocols.ALL_JOBS, msg)
				setTimeout(() => {
					selectJob()
				}, 3000)
			}
		}, 5000)
	}

	const handleDirect = function(this: Socket, msg: Message) {
		console.log("|- MachineAgent: Received a direct message")
		if (msg.subject == MessageSubjects.JOB_IS_AVAILABLE) {
			jobs.push(msg)
		}
		if (msg.subject == MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER) {
			console.log("|- MachineAgent: Passing on the GCode")
			jobs = []
			$machine.gcode = msg.body.gcode
		}
		if (msg.subject == MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER) {
			jobs = []
		}
	}

	const handleConnectionError = function(this: Socket) {
		console.log("Connection Error")
	}

	const selectJob = () => {
		// Pick the first job from the list
		if (jobs.length > 0) {
			const job = jobs[0]
			const msg: Message = {
				fromId: socket.id,
				toId: job.fromId,
				subject: MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB,
				body: {
					machineType: $machine.machineType,
				},
			}
			socket.emit(MessageProtocols.DIRECT, msg)
		}
	}
</script>

<h5>Broker the Machine</h5>

<dl class="row">
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
</dl>

<FormGroup >
	<Label size="sm">Access Key</Label>
	<Input 
		type="text" 
		bind:value={token} 
		invalid={!token} 
		feedback="Access Key Required"
	/>
</FormGroup>

<FormGroup>
	<Label size="sm">Group</Label>
	<Input 
		type="text" 
		bind:value={group}
		invalid={!group} 
		feedback="Group Required"
	/>
</FormGroup>

<FormGroup>
	<Button 
		color="primary"
		disabled={isConnected}
		on:click={connect}>
		Connect
	</Button>
	<Button
		color="danger" 
		disabled={!isConnected}
		on:click={disconnect}>
		Disconnect
	</Button>
</FormGroup>