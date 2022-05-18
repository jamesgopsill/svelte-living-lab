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
				$machine.gcode = ""
			}, 5000)
		}
	}
</script>

<hr />
<h5>Dummy Machine</h5>
<dl class="row">
	<dt class="col-sm-3">Machine Status:</dt>
	<dd class="col-sm-9"><Badge>{status}</Badge></dd>
	<dt class="col-sm-3">Machine Available:</dt>
	<dd class="col-sm-9"><Badge>{$machine.available}</Badge></dd>
</dl>
<FormGroup>
	<Input bind:checked={$machine.available} type="switch" label="Toggle to make available" />
</FormGroup>
<hr />