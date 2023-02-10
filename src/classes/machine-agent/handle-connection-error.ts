import type { MachineAgent } from "."

export function handleConnectionError(this: MachineAgent, err: Error) {
	console.log(`Connection Error: ${err}`)
	if (this.socket) {
		this.socket.close()
		this.socket = null
	}
	if (this.interval) {
		clearInterval(this.interval)
		this.interval = null
	}
}
