<script lang="ts">
	import { FormGroup, InputGroup, InputGroupText, Input } from "sveltestrap"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "./stores/settings-store"
</script>

<h5>BAM Configuration Settings</h5>

<FormGroup>
	<InputGroup>
		<InputGroupText>BAM Broker URL</InputGroupText>
		<Input
			type="text"
			bind:value={$bamBrokerURL}
			invalid={!$bamBrokerURL}
			feedback="Access Key Required"
		/>
	</InputGroup>
</FormGroup>

<FormGroup>
	<InputGroup>
		<InputGroupText>BAM Access Key</InputGroupText>
		<Input
			type="text"
			bind:value={$bamAccessKey}
			invalid={!$bamAccessKey}
			feedback="Access Key Required"
		/>
	</InputGroup>
</FormGroup>

<FormGroup>
	<InputGroup>
		<InputGroupText>BAM Group</InputGroupText>
		<Input
			type="text"
			bind:value={$bamGroup}
			invalid={!$bamGroup}
			feedback="Group Required"
		/>
	</InputGroup>
</FormGroup>
