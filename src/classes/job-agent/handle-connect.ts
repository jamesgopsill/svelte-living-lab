import type { JobAgent } from "."
import { JobStates } from "../../definitions/enums"

export function handleConnect(this: JobAgent) {
	console.log("Connected")
	this.connected.set(true)
	this.id.set(this.socket.id)
	this.state.set(JobStates.AVAILABLE)
}
