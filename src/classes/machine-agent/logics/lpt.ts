import type { MachineAgent } from ".."
import type { DirectMessage } from "../../../definitions/interfaces"
import { MessageSubjects, SocketEvents } from "../../../definitions/enums"
import { get } from "svelte/store"

export function lpt(this: MachineAgent) {
	if (this.responses.length > 0) {
		let idx = 0
		let printTime = 0
		for (const [i, job] of this.responses.entries()) {
			if (job.body.printTime > printTime) {
				idx = i
				printTime = job.body.printTime
			}
		}
		const job = this.responses[idx]
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
