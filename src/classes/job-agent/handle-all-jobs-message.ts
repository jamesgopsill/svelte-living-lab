import { get } from "svelte/store"
import type { JobAgent } from "."
import {
	JobStates,
	MessageSubjects,
	SocketEvents,
} from "../../definitions/enums"
import type { AllMessage, DirectMessage } from "../../definitions/interfaces"

export function handleAllJobsMessage(this: JobAgent, msg: AllMessage): void {
	const state = get(this.state)
	const gcode = get(this.gcode)
	this.messages.update((u) => {
		u.push(
			`${new Date().toISOString()}: received ALL_JOBS message. I am ${state}`
		)
		return u
	})
	// Respond to the machine
	if (
		msg.subject == MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS &&
		state == JobStates.AVAILABLE &&
		gcode[msg.body.machineType]
	) {
		const response: DirectMessage = {
			to: msg.from,
			from: this.socket.id,
			subject: MessageSubjects.JOB_IS_AVAILABLE,
			body: {
				createdDate: this.createdDate,
				printTime: this.estimatedPrintTime,
			},
			extra: msg.extra,
		}
		this.socket.emit(SocketEvents.DIRECT, response)
	}
}
