<script lang="ts">
	import {
		InputGroup,
		InputGroupText,
		Input,
		FormGroup,
		Button,
		ButtonGroup,
	} from "sveltestrap"
	import { Tracker } from "../classes/tracker"

	let tracker = new Tracker()
	let { contractId, messages, connected } = tracker
</script>

<h3 class="mt-3 mb-3">Track a contract</h3>

<InputGroup class="mb-3" size="sm">
	<InputGroupText>Contract</InputGroupText>
	<Input
		placeholder="Contract Id"
		bind:value={$contractId}
		invalid={!$contractId}
	/>
	<Button
		size="sm"
		color="primary"
		disabled={$connected}
		on:click={() => {
			tracker.getUpdates()
		}}
	>
		Get Updates
	</Button>
</InputGroup>

<h4>Messages</h4>
<small class="text-muted">
	<ul>
		{#each $messages as m}
			<li>{m.date}: {m.msg}</li>
		{/each}
	</ul>
</small>
