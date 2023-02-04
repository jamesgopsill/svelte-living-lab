import type { JobAgent } from "."
import {
	JobStates,
	MessageSubjects,
	SocketEvents,
} from "../../definitions/enums"
import type { DirectMessage } from "../../definitions/interfaces"

export function handleDirectMessage(this: JobAgent, msg: DirectMessage): void {
	this.messages.update((u) => {
		u.push(`${new Date().toISOString()}: Job received DIRECT message`)
		return u
	})

	if (
		msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB &&
		//@ts-expect-error
		this.state == JobStates.AVAILABLE
	) {
		this.messages.update((u) => {
			u.push(`${new Date().toISOString()}: Job responding with accept.`)
			return u
		})
		if (this.gcode[msg.body.machineType]) {
			const response: DirectMessage = {
				to: msg.from,
				from: this.socket.id,
				subject: MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER,
				body: {
					gcode: this.gcode[msg.body.machineType],
				},
				extra: {},
			}
			this.socket.emit(SocketEvents.DIRECT, response)
			//@ts-ignore
			this.state.set(JobStates.SELECTED)
			this.messages.update((u) => {
				u.push(`${new Date().toISOString()}: Job has been accepted.`)
				return u
			})
		} else {
			this.messages.update((u) => {
				u.push(`${new Date().toISOString()}: Job responding with decline.`)
				return u
			})
			const response: DirectMessage = {
				to: msg.from,
				from: this.socket.id,
				subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
				body: {},
				extra: {},
			}
			this.socket.emit(SocketEvents.DIRECT, response)
		}
		return
	}

	if (msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB) {
		this.messages.update((u) => {
			u.push(`${new Date().toISOString()}: Job responding with decline.`)
			return u
		})
		const response: DirectMessage = {
			to: msg.from,
			from: this.socket.id,
			subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
			body: {},
			extra: {},
		}
		this.socket.emit(SocketEvents.DIRECT, response)
		return
	}

	if (msg.subject == MessageSubjects.CONTRACT_ID) {
		this.messages.update((u) => {
			u.push(`${new Date().toISOString()}: Contracts ID ${msg.body.id}`)
			return u
		})
		return
	}

	return
}
