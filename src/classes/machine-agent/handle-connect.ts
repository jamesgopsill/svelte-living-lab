import { get } from "svelte/store"
import type { MachineAgent } from "."
import {
	MachineAgentLogics,
	MessageSubjects,
	SocketEvents,
} from "../../definitions/enums"
import type { AllMessage } from "../../definitions/interfaces"
import { fcfs } from "./logics/fcfs"
import { frfs } from "./logics/frfs"
import { lpt } from "./logics/lpt"
import { spt } from "./logics/spt"

function selectJob(this: MachineAgent) {
	switch (get(this.logic)) {
		case MachineAgentLogics.FIRST_RESPONSE_FIRST_SERVE:
			frfs.bind(this)()
			break
		case MachineAgentLogics.FIRST_COME_FIRST_SERVE:
			fcfs.bind(this)()
			break
		case MachineAgentLogics.LONGEST_PRINT_TIME:
			lpt.bind(this)()
			break
		case MachineAgentLogics.SHORTEST_PRINT_TIME:
			spt.bind(this)()
			break
		default:
			frfs.bind(this)()
			break
	}
	this.responses = []
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
			setTimeout(selectJob.bind(this)(), 3000)
		}
	}, 6000)
}
