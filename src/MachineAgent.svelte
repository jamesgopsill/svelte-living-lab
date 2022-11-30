<script lang="ts">
	import { Badge, FormGroup, Button } from "sveltestrap"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import { MessageProtocols, MessageSubjects } from "./enums"
	import type { Message, ProgressUpdate } from "./interfaces"
	import machine from "./stores/machine-store"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "./stores/settings-store"
	import { v4 as uuidv4 } from "uuid"

	let socket: Socket
	let isConnected = false
	let interval: any
	let jobs = []

	const connect = () => {
		if (!$bamAccessKey || !$bamGroup) {
			return
		}

		//const url = "https://www.workshop-jobs.com"
		const ioConfig = {
			auth: {
				token: $bamAccessKey,
			},
			extraHeaders: {
				"agent-type": "machine",
				"group-key": $bamGroup,
			},
			path: "/socket/",
		}
		socket = io($bamBrokerURL, ioConfig)
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

	const handleConnect = function (this: Socket) {
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

	const handleDirect = function (this: Socket, msg: Message) {
		console.log("|- MachineAgent: Received a direct message")
		if (msg.subject == MessageSubjects.JOB_IS_AVAILABLE) {
			jobs.push(msg)
		}
		if (msg.subject == MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER) {
			console.log("|- MachineAgent: Passing on the GCode")
			jobs = []
			$machine.currentJob.transactionId = uuidv4()
			$machine.currentJob.gcode = msg.body.gcode
			$machine.currentJob.status = "Queued"
			const response: Message = {
				fromId: this.id,
				toId: msg.fromId,
				subject: MessageSubjects.TRANSACTION_ID,
				body: {
					id: $machine.currentJob.transactionId
				},
			}
			socket.emit(MessageProtocols.DIRECT, response)
			const postUpdate: ProgressUpdate = {
				transactionId: $machine.currentJob.transactionId,
				status: "Queued"
			}
			socket.emit(MessageProtocols.POST_PROGRESS, postUpdate)

			// TODO:
			// Add a means to update the progress update/
			// Add a page for people to query jobs.
		}
		if (msg.subject == MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER) {
			jobs = []
		}
	}

	const handleConnectionError = function (this: Socket) {
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

	$: {
		if ($machine.currentJob.transactionId && socket && socket.connected) {
			const postUpdate: ProgressUpdate = {
				transactionId: $machine.currentJob.transactionId,
				status: $machine.currentJob.status
			}
			socket.emit(MessageProtocols.POST_PROGRESS, postUpdate)
		}
	}
</script>

<h5>Broker Machine</h5>

<Badge pill={true}>{$bamBrokerURL}</Badge>
<!-- <Badge pill={true}>{$bamAccessKey}</Badge> -->
<Badge pill={true}>{$bamGroup}</Badge>
<br /><br />

<dl class="row">
	<dt class="col-3">Socket Status:</dt>
	<dd class="col-3">
		{#if socket}
			{socket.connected}
		{/if}
	</dd>
	<dt class="col-3">Socket Id:</dt>
	<dd class="col-3">
		{#if socket}
			{socket.id}
		{/if}
	</dd>
</dl>

<FormGroup>
	<Button color="primary" disabled={isConnected} on:click={connect}>
		Connect
	</Button>
	<Button color="danger" disabled={!isConnected} on:click={disconnect}>
		Disconnect
	</Button>
</FormGroup>
