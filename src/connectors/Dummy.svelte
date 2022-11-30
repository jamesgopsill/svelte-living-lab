<script lang="ts">
	import { Input, FormGroup } from "sveltestrap"
	import machine from "../stores/machine-store"

	let status = "idle"

	$: {
		console.log("Machine Updated")
		if ($machine.currentJob.gcode) {
			console.log("Machine Details Updated")
			// If machine code is available
			$machine.available = false
			$machine.currentJob.status = "Printing"
			status = "printing"
			// 'Print' for 5 seconds
			setTimeout(() => {
				status = "idle"
				$machine.currentJob.gcode = ""
				$machine.currentJob.status = "Complete"
			}, 5000)
		}
	}
</script>

<hr />
<h5>Dummy Machine</h5>
<dl class="row">
	<dt class="col-6">Machine Status:</dt>
	<dd class="col-6">{status}</dd>
	<dt class="col-6">Machine Available:</dt>
	<dd class="col-6">{$machine.available}</dd>
	<dt class="col-6">Current Job Transaction ID:</dt>
	<dd class="col-6">{$machine.currentJob.transactionId}</dd>
	<dt class="col-6">Current Job Status:</dt>
	<dd class="col-6">{$machine.currentJob.status}</dd>
</dl>
<FormGroup>
	<Input
		bind:checked={$machine.available}
		type="switch"
		label="Toggle to make available"
	/>
</FormGroup>
