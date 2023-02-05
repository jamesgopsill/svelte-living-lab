import type { Socket } from "socket.io-client"
import { writable } from "svelte/store"
import { MachineJobStates, MachineTypes } from "../../definitions/enums"
import type { DirectMessage } from "../../definitions/interfaces"
import { connect } from "./connect"
import { disconnect } from "./disconnect"
import { postUpdate } from "./post-update"

export class MachineAgent {
	available = writable<boolean>(false)
	machineType = writable<MachineTypes>(MachineTypes.DUMMY)
	gcode = writable<string>("")
	contractId = writable<string>("")
	socketId = writable<string>("")
	jobStatus = writable<MachineJobStates>(MachineJobStates.NULL)

	socket: Socket | null = null
	responses: DirectMessage[] = []
	interval: number | null

	constructor() {}

	connect = connect
	disconnect = disconnect

	postUpdate = postUpdate
}

export const machineAgent = new MachineAgent()
