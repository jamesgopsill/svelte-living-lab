<script lang="ts">
	import {
		InputGroup,
		InputGroupText,
		Input,
		FormGroup,
		Button,
	} from "sveltestrap"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "../stores/settings"
	import { Tracker } from "../classes/tracker"

	let tracker = new Tracker()
	let { contractId, messages } = tracker
</script>

<h2 class="mt-3 mb-3">Track your contract.</h2>

<InputGroup class="mb-1" size="sm">
	<InputGroupText>Contract</InputGroupText>
	<Input
		placeholder="Contract Id"
		bind:value={$contractId}
		invalid={!$contractId}
		feedback="Contract Id Required"
	/>
</InputGroup>

<FormGroup class="mt-3">
	<Button
		size="sm"
		color="primary"
		disabled={false}
		on:click={() => {
			tracker.getUpdates($bamBrokerURL, $bamAccessKey, $bamGroup)
		}}
	>
		Get Updates
	</Button>
</FormGroup>

<p class="lead">Messages</p>
<small class="text-muted">
	<ul>
		{#each $messages as m}
			<li>{m.msg}</li>
		{/each}
	</ul>
</small>
