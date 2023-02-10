<script lang="ts">
	import { InputGroup, Input, InputGroupText, Button } from "sveltestrap"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "../stores/settings"
	import io, { type Socket } from "socket.io-client"
	import { SocketEvents } from "../definitions/enums"

	const ping = async () => {
		const url = $bamBrokerURL
		// Creating the connection
		const ioConfig = {
			auth: {
				token: $bamAccessKey,
			},
			extraHeaders: {
				"agent-type": "job",
				"group-key": "ping",
			},
			path: "/socket/",
		}

		io(url, ioConfig)
			.on(SocketEvents.CONNECT, function (this: Socket) {
				this.close()
				alert("SUCCESS: I am able to connect!")
			})
			.on(SocketEvents.CONNECT_ERROR, function (this: Socket, err: Error) {
				this.close()
				alert("ERROR: Could not connect")
			})
	}
</script>

<h5 class="mt-3 mb-3">BAM Configuration Settings</h5>

<InputGroup class="mb-1" size="sm">
	<InputGroupText>API Endpoint</InputGroupText>
	<Input
		placeholder="http://some.where"
		bind:value={$bamBrokerURL}
		invalid={!$bamBrokerURL}
		feedback="Access Key Required"
	/>
</InputGroup>

<InputGroup class="mb-1" size="sm">
	<InputGroupText>Access Key</InputGroupText>
	<Input
		placeholder="Access Key"
		bind:value={$bamAccessKey}
		invalid={!$bamAccessKey}
		feedback="Access Key Required"
	/>
</InputGroup>

<InputGroup class="mb-1" size="sm">
	<InputGroupText>Group</InputGroupText>
	<Input
		placeholder="Group"
		type="text"
		bind:value={$bamGroup}
		invalid={!$bamGroup}
		feedback="Group Required"
	/>
</InputGroup>

<Button color="info" on:click={ping}>Test</Button>
