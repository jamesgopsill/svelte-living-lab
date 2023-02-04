<script lang="ts">
	import { FormGroup, Button } from "sveltestrap"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import {
		SocketEvents,
		MessageSubjects,
		MachineTypes,
		MachineJobStates,
	} from "../definitions/enums"
	import type {
		DirectMessage,
		AllMessage,
		ContractUpdate,
	} from "../definitions/interfaces"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "../stores/settings"
	import { v4 as uuidv4 } from "uuid"

	export let machineAvailable: boolean
	export let machineType: MachineTypes
	export let gcode: string
	export let contractId: string
	export let jobStatus: MachineJobStates

	let socket: Socket
	let isConnected = false
	let interval: any
	let jobs = []

	const connect = () => {
		if (!$bamAccessKey || !$bamGroup) {
			return
		}

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
			.on(SocketEvents.CONNECT, handleConnect)
			.on(SocketEvents.DIRECT, handleDirect)
			.on(SocketEvents.MESSAGE_ERROR, (msg: string) => console.log(msg))
			.on(SocketEvents.CONNECT_ERROR, handleConnectionError)
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
			console.log(`|- MachineAgent: loop, Available: ${machineAvailable}}`)
			if (machineAvailable) {
				const msg: AllMessage = {
					from: socket.id,
					subject: MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS,
					body: {
						machineType: machineType,
					},
					extra: {},
				}
				socket.emit(SocketEvents.ALL_JOBS, msg)
				setTimeout(() => {
					selectJob()
				}, 3000)
			}
		}, 5000)
	}

	const handleDirect = function (this: Socket, msg: DirectMessage) {
		console.log("|- MachineAgent: Received a direct message")
		if (msg.subject == MessageSubjects.JOB_IS_AVAILABLE) {
			jobs.push(msg)
		}
		// TODO: need to put a check in that the machine hasn't accepted another job within the time span.
		// But this should be accounted for in the timeout between searches.
		if (msg.subject == MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER) {
			console.log("|- MachineAgent: Passing on the GCode")
			jobs = []
			contractId = uuidv4()
			gcode = msg.body.gcode
			jobStatus = MachineJobStates.QUEUED
			const response: DirectMessage = {
				from: this.id,
				to: msg.from,
				subject: MessageSubjects.CONTRACT_ID,
				body: {
					id: contractId,
				},
				extra: {},
			}
			socket.emit(SocketEvents.DIRECT, response)
			const postUpdate: ContractUpdate = {
				id: contractId,
				msg: "Queued",
			}
			socket.emit(SocketEvents.POST_CONTRACT, postUpdate)
		}
		if (msg.subject == MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER) {
			jobs = []
		}
	}

	const handleConnectionError = function (this: Socket) {
		console.log("Connection Error")
		socket = undefined
		isConnected = false
	}

	const selectJob = () => {
		// Pick the first job from the list
		if (jobs.length > 0) {
			const job = jobs[0]
			const msg: DirectMessage = {
				from: socket.id,
				to: job.from,
				subject: MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB,
				body: {
					machineType: machineType,
				},
				extra: {},
			}
			socket.emit(SocketEvents.DIRECT, msg)
		}
	}

	$: {
		if (contractId && jobStatus && socket && socket.connected) {
			const postUpdate: ContractUpdate = {
				id: contractId,
				msg: jobStatus,
			}
			socket.emit(SocketEvents.POST_CONTRACT, postUpdate)
		}
	}
</script>

<small class="text-muted">
	<ul class="list-inline">
		<li class="list-inline-item">| Broker URL: {$bamBrokerURL}</li>
		<li class="list-inline-item">| Group: {$bamGroup}</li>
		<li class="list-inline-item">
			| Connected: {#if socket}{socket.connected}{/if}
		</li>
		<li class="list-inline-item">
			| Connection Id: {#if socket}
				{socket.id}
			{/if}
		</li>
	</ul>
</small>

<FormGroup>
	<Button size="sm" color="primary" disabled={isConnected} on:click={connect}>
		Connect
	</Button>
	<Button
		size="sm"
		color="danger"
		disabled={!isConnected}
		on:click={disconnect}
	>
		Disconnect
	</Button>
</FormGroup>
