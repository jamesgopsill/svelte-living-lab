<script lang="ts">
	import { Input, FormGroup } from "sveltestrap"
	import machine from "../stores/machine-store"

	let status = "idle"

	$: {
		if ($machine.gcode) {
			// If machine code is availate
			$machine.available = false
			status = "printing"
			// 'Print' for 5 seconds
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
	<dt class="col-3">Machine Status:</dt>
	<dd class="col-3">{status}</dd>
	<dt class="col-3">Machine Available:</dt>
	<dd class="col-3">{$machine.available}</dd>
</dl>
<FormGroup>
	<Input
		bind:checked={$machine.available}
		type="switch"
		label="Toggle to make available"
	/>
</FormGroup>
<hr />
