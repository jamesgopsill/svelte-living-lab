import { get } from "svelte/store"
import type { MachineAgent } from "."
import { MessageSubjects, SocketEvents } from "../../definitions/enums"
import type { AllMessage, DirectMessage } from "../../definitions/interfaces"

function selectJob(this: MachineAgent) {
	if (this.responses.length > 0) {
		const job = this.responses[0]
		const msg: DirectMessage = {
			from: this.socket.id,
			to: job.from,
			subject: MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB,
			body: {
				machineType: get(this.machineType),
			},
			extra: {},
		}
		this.socket.emit(SocketEvents.DIRECT, msg)
	}
}

export function handleConnect(this: MachineAgent) {
	this.socketId.set(this.socket.id)
	this.interval = setInterval(() => {
		console.log(`|- MachineAgent: loop, Available: ${get(this.available)}}`)
		if (get(this.available)) {
			const msg: AllMessage = {
				from: this.socket.id,
				subject: MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS,
				body: {
					machineType: get(this.machineType),
				},
				extra: {},
			}
			this.socket.emit(SocketEvents.ALL_JOBS, msg)
			// Will need to check this.
			setTimeout(selectJob.bind(this), 3000)
		}
	}, 6000)
}
