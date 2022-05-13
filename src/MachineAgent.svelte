<script lang="ts">
	import { FormGroup, Label, Input, Button } from "sveltestrap"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import { MessageProtocols, MessageSubjects } from "./enums"
	import type { Message } from "./interfaces";

	let token = ""
	let group = ""
	let socket: Socket
	let isConnected = false
	let interval: any

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
		interval = setInterval(() => {
			console.log("loop")
		}, 3000)
		// TODO: add the machine logic
	}

	const handleDirect = function(this: Socket, msg: Message) {
		console.log("Direct Message")
	}

	const handleConnectionError = function(this: Socket) {
		console.log("Connection Error")
	}
</script>

<h5>Broker Machine</h5>

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