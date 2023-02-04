<script lang="ts">
	import { InputGroup, Input, InputGroupText } from "sveltestrap"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "../stores/settings"
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
