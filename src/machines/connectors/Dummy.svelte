<script lang="ts">
	import { MachineStates, MachineJobStates } from "../../definitions/enums"
	import { Input } from "sveltestrap"

	export let jobStatus: string
	export let gcode: string
	export let machineStatus: MachineStates
	export let machineAvailable: boolean

	$: {
		if (gcode) {
			console.log("Machine Details Updated")
			// If machine code is available
			machineAvailable = false
			jobStatus = MachineJobStates.PRINTING
			machineStatus = MachineStates.PRINTING
			gcode = ""
			// 'Print' for 5 seconds
			setTimeout(() => {
				machineStatus = MachineStates.IDLE
				jobStatus = MachineJobStates.COMPLETE
				gcode = ""
			}, 5000)
		}
	}

	$: {
		if (machineAvailable && machineStatus == MachineStates.OFFLINE) {
			machineStatus = MachineStates.IDLE
		}
		if (!machineAvailable && machineStatus == MachineStates.IDLE) {
			machineStatus = MachineStates.OFFLINE
		}
	}
</script>

<Input
	bind:checked={machineAvailable}
	type="switch"
	label="Toggle to make the machine available."
/>
