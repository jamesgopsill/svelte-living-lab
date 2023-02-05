<script lang="ts">
	import { MachineJobStates } from "../../definitions/enums"
	import { Input } from "sveltestrap"
	import { machineAgent } from "../../classes/machine-agent"

	let { gcode, available, jobStatus } = machineAgent

	$: {
		if ($gcode) {
			console.log("Machine Details Updated")
			// If machine code is available
			available.set(false)
			jobStatus.set(MachineJobStates.PRINTING)
			//machineStatus = MachineStates.PRINTING
			gcode.set("")
			// 'Print' for 5 seconds
			setTimeout(() => {
				// machineStatus.set(MachineStates.IDLE)
				jobStatus.set(MachineJobStates.COMPLETE)
				gcode.set("")
			}, 5000)
		}
	}

	/*
	$: {
		if (machineAvailable && machineStatus == MachineStates.OFFLINE) {
			machineStatus = MachineStates.IDLE
		}
		if (!machineAvailable && machineStatus == MachineStates.IDLE) {
			machineStatus = MachineStates.OFFLINE
		}
	}
	*/
</script>

<Input
	bind:checked={$available}
	type="switch"
	label="Toggle to make the machine available."
/>
