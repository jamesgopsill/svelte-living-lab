<script lang="ts">
	import { MachineJobStates } from "../../definitions/enums"
	import { Input } from "sveltestrap"
	import { machineAgent } from "../../classes/machine-agent"

	let { gcode, available, jobStatus, contractId } = machineAgent

	$: {
		console.log("Reaction activated")
		console.log($gcode)
		if ($gcode.length > 0) {
			console.log("Machine Details Updated")
			// If machine code is available
			available.set(false)
			jobStatus.set(MachineJobStates.PRINTING)
			gcode.set("")
			machineAgent.postUpdate("Printing started.")
			// 'Print' for 5 seconds
			setTimeout(() => {
				jobStatus.set(MachineJobStates.COMPLETE)
				gcode.set("")
				machineAgent.postUpdate("Printing complete.")
				contractId.set("")
			}, 5000)
		}
	}
</script>

<Input
	bind:checked={$available}
	type="switch"
	label="Toggle to make the machine available."
/>
