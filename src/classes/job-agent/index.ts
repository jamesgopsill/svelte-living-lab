import type { Socket } from "socket.io-client"
import { writable } from "svelte/store"
import { JobStates } from "../../definitions/enums"
import { connect } from "./connect"
import { disconnect } from "./disconnect"

export class JobAgent {
	name = writable<string>("")
	id = writable<string>("")
	connected = writable<boolean>(false)
	state = writable<JobStates>(JobStates.NOT_ONLINE)
	gcode = writable<{ [k: string]: string }>({})
	estimatedPrintTime = writable<number>(0)
	createdDate: number = new Date().getTime()
	socket: Socket | null
	messages = writable<string[]>([])

	constructor() {}

	connect = connect
	disconnect = disconnect
}
