import type { MachineAgent } from ".."
import type { DirectMessage } from "../../../definitions/interfaces"
import { MessageSubjects, SocketEvents } from "../../../definitions/enums"
import { get } from "svelte/store"

export function fcfs(this: MachineAgent) {
	if (this.responses.length > 0) {
		let idx = 0
		let createdDate = 99999999999999
		for (const [i, job] of this.responses.entries()) {
			if (job.body.createdDate < createdDate) {
				idx = i
				createdDate = job.body.createdDate
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
			extra: job.extra,
		}
		this.socket.emit(SocketEvents.DIRECT, msg)
	}
}
