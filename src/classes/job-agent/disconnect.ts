import type { JobAgent } from "."
import { JobStates } from "../../definitions/enums"

export function disconnect(this: JobAgent) {
	if (this.socket) {
		this.socket.close()
		this.socket = null
	}
	this.connected.set(false)
	this.id.set("")
	this.state.set(JobStates.NOT_ONLINE)
}
