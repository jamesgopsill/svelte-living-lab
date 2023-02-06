import type { MachineAgent } from ".."
import type { DirectMessage } from "../../../definitions/interfaces"
import { MessageSubjects, SocketEvents } from "../../../definitions/enums"
import { get } from "svelte/store"

export function frfs(this: MachineAgent) {
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
