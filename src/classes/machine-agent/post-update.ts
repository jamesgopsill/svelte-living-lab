import { get } from "svelte/store"
import type { MachineAgent } from "."
import { SocketEvents } from "../../definitions/enums"
import type { ContractEntry } from "../../definitions/interfaces"

export function postUpdate(this: MachineAgent, msg: string) {
	const contractId = get(this.contractId)
	if (this.socket && contractId.length > 0) {
		const payload: ContractEntry = {
			id: contractId,
			msg,
		}
		this.socket.emit(SocketEvents.POST_CONTRACT, payload)
	}
}
