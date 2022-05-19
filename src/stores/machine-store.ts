import { writable } from "svelte/store"
import type { MachineTypes, MachineConnectionTypes } from "../enums"

export interface Machine {
	machineType: MachineTypes | null
	connectionType: MachineConnectionTypes | null
	available: boolean
	gcode: string
}

export default writable<Machine>({
	machineType: null,
	connectionType: null,
	available: false,
	gcode: "",
})
