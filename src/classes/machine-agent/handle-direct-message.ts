import { get } from "svelte/store"
import { v4 as uuidv4 } from "uuid"
import type { MachineAgent } from "."
import {
	MachineJobStates,
	MessageSubjects,
	SocketEvents,
} from "../../definitions/enums"
import type { DirectMessage } from "../../definitions/interfaces"

export function handleDirectMessage(this: MachineAgent, msg: DirectMessage) {
	console.log("|- MachineAgent: Received a direct message")

	switch (msg.subject) {
		case MessageSubjects.JOB_IS_AVAILABLE:
			this.responses.push(msg)
			break
		case MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER:
			// TODO: need to put a check in that the machine hasn't
			// accepted another job within the time span.
			// But this should be accounted for in the timeout between searches.
			console.log("|- MachineAgent: Passing on the GCode")
			this.responses = []
			this.contractId.set(uuidv4())
			console.log(msg.body)
			if (!msg.body.gcode) {
				alert("ERROR: no gcode in body")
				break
			}
			this.gcode.set(msg.body.gcode)
			this.jobStatus.set(MachineJobStates.QUEUED)
			// TODO: this within the agent when the gcode appears
			const response: DirectMessage = {
				from: this.socket.id,
				to: msg.from,
				subject: MessageSubjects.CONTRACT_ID,
				body: {
					id: get(this.contractId),
				},
				extra: msg.extra,
			}
			this.socket.emit(SocketEvents.DIRECT, response)
			this.postUpdate("Queued")
			break
		case MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER:
			this.responses = []
			break
		default:
			break
	}

	return
}
