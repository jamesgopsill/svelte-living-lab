<script lang="ts">
	import { FormGroup, Button } from "sveltestrap"
	import { machineAgent } from "../classes/machine-agent"
	import { bamGroup, bamBrokerURL } from "../stores/settings"

	let { socketId } = machineAgent
</script>

<small class="text-muted">
	<ul class="list-inline">
		<li class="list-inline-item">| Broker URL: {$bamBrokerURL}</li>
		<li class="list-inline-item">| Group: {$bamGroup}</li>
		<li class="list-inline-item">| Connected Id: {$socketId}</li>
	</ul>
</small>

<FormGroup>
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
</FormGroup>
