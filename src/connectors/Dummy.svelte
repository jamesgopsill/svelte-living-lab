<script lang="ts">
	import { Input, FormGroup, Badge } from "sveltestrap"
	import machine from "../stores/machine-store"

	let status = "idle"

	$: {
		if ($machine.gcode) {
			$machine.available = false
			status = "printing"
			setTimeout(() => {
				status = "idle"
			}, 5000)
		}
	}
</script>

<hr />
<h5>Dummy Machine</h5>
<dl class="row">
	<dt class="col-sm-3">Machine Status:</dt>
	<dd class="col-sm-9"><Badge>{status}</Badge></dd>
</dl>
<FormGroup>
	<Input bind:value={$machine.available} type="switch" label="Switch to make available" />
</FormGroup>
<hr />