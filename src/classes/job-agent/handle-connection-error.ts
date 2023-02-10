import type { JobAgent } from "."

export function handleConnectionError(this: JobAgent, err: Error) {
	console.log(`Connection Error: ${err}`)
	if (this.socket) {
		this.socket.close()
		this.socket = null
	}
}
