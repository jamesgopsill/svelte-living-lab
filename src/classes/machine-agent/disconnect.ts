import type { MachineAgent } from "."

export function disconnect(this: MachineAgent) {
	if (this.socket) {
		this.socket.close()
		this.socket = null
	}
	if (this.interval) {
		clearInterval(this.interval)
		this.interval = null
	}
	this.socketId.set("")
}
