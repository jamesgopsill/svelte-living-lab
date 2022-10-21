<script lang="ts">
	import { FormGroup, Input } from "sveltestrap"
	import { bamAccessKey, bamGroup, bamBrokerURL } from "./stores/settings-store"
</script>

<h5 class="mt-3 mb-3">BAM Configuration Settings</h5>

<FormGroup floating label="API Endpoint">
	<Input
		type="text"
		bind:value={$bamBrokerURL}
		invalid={!$bamBrokerURL}
		feedback="Access Key Required"
	/>
</FormGroup>

<FormGroup floating label="BAM Access Key">
	<Input
		type="text"
		bind:value={$bamAccessKey}
		invalid={!$bamAccessKey}
		feedback="Access Key Required"
	/>
</FormGroup>

<FormGroup floating label="BAM Group">
	<Input
		type="text"
		bind:value={$bamGroup}
		invalid={!$bamGroup}
		feedback="Group Required"
	/>
</FormGroup>

<img
	alt=""
	width="50%"
	src="https://dmf-lab.co.uk/wp-content/uploads/2021/05/Logo_with_uob_lowres.png"
/>
