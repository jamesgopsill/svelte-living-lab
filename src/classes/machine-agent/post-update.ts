import { get } from "svelte/store"
import type { MachineAgent } from "."
import { SocketEvents } from "../../definitions/enums"
import type { ContractUpdate } from "../../definitions/interfaces"

export function postUpdate(this: MachineAgent, msg: string) {
	const id = get(this.contractId)
	if (this.socket && id.length > 0) {
		const payload: ContractUpdate = {
			id,
			msg,
		}
		this.socket.emit(SocketEvents.POST_CONTRACT, msg)
	}
}
