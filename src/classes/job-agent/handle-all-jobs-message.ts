import type { JobAgent } from "."
import {
	JobStates,
	MessageSubjects,
	SocketEvents,
} from "../../definitions/enums"
import type { AllMessage, DirectMessage } from "../../definitions/interfaces"

export function handleAllJobsMessage(this: JobAgent, msg: AllMessage): void {
	this.messages.update((u) => {
		u.push(
			`${new Date().toISOString()}: received ALL_JOBS message. I am ${
				this.state
			}`
		)
		return u
	})
	// Respond to the machine
	if (
		msg.subject == MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS &&
		//@ts-expect-error
		this.state == JobStates.AVAILABLE &&
		this.gcode[msg.body.machineType]
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
