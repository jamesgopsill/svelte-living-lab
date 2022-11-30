<script lang="ts">
	import { FormGroup, Input, Button, ListGroup, ListGroupItem } from "sveltestrap"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "./stores/settings-store"
	import { io } from "socket.io-client"
	import type { Socket } from "socket.io-client"
	import { MessageProtocols } from "./enums"
	import type { TransactionHistory } from "./interfaces"

	let transactionId = ""
	let history: TransactionHistory[] = []
	let socket = undefined

	const check = () => {
		console.log("Check Transaction")

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
			.on(MessageProtocols.GET_PROGRESS, handleGetProgress)
			.on(MessageProtocols.MESSAGE_ERROR, (msg: string) => console.log(msg))
			.on(MessageProtocols.CONNECT_ERROR, handleConnectionError)
	}

	const handleConnect = function (this: Socket) {
		this.emit(MessageProtocols.GET_PROGRESS, transactionId)
	}

	const handleConnectionError = function (this: Socket, err: string) {
		console.log(`Connection Error: ${err}`)
		this.close()
		socket = undefined
	}

	const handleGetProgress = function (this: Socket, msg: any) {
		console.log(msg)
		history = msg
		socket.close()
		socket = undefined
	}



</script>


<FormGroup floating label="Transaction ID">
	<Input
		type="text"
		bind:value={transactionId}
		invalid={!transactionId}
	/>
</FormGroup>

<FormGroup>
	<Button
		color="primary"
		on:click={check}
	>
	Track
	</Button>
</FormGroup>

<ListGroup>
	{#each history as row}
		<ListGroupItem>{row.createdAt} - {row.status}</ListGroupItem>
	{/each}
</ListGroup>