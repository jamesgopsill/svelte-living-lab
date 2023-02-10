<script lang="ts">
	import { MachineAgentLogics } from "../definitions/enums"
	import { Button, InputGroup, InputGroupText, Input } from "sveltestrap"
	import { machineAgent } from "../classes/machine-agent"
	import { bamGroup, bamBrokerURL } from "../stores/settings"

	let { socketId, logic } = machineAgent
</script>

<small class="text-muted">
	<ul class="list-inline mt-3">
		<li class="list-inline-item">| Broker URL: {$bamBrokerURL}</li>
		<li class="list-inline-item">| Group: {$bamGroup}</li>
		<li class="list-inline-item">| Connected Id: {$socketId}</li>
	</ul>
</small>

<InputGroup size="sm" class="mb-2">
	<InputGroupText>Logic</InputGroupText>
	<Input type="select" name="select" bind:value={$logic}>
		<option value={MachineAgentLogics.FIRST_RESPONSE_FIRST_SERVE}
			>First Response First Serve</option
		>
		<option value={MachineAgentLogics.FIRST_COME_FIRST_SERVE}
			>First Come First Serve</option
		>
		<option value={MachineAgentLogics.SHORTEST_PRINT_TIME}
			>Shortest Print Time</option
		>
		<option value={MachineAgentLogics.LONGEST_PRINT_TIME}
			>Longest Print Time</option
		>
	</Input>
	<Button
		size="sm"
		color="primary"
		disabled={!!$socketId}
		on:click={() => machineAgent.connect()}
	>
		Connect
	</Button>
	<Button
		size="sm"
		color="danger"
		disabled={!$socketId}
		on:click={() => machineAgent.disconnect()}
	>
		Disconnect
	</Button>
</InputGroup>
