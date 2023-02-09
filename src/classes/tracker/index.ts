import { io, type Socket } from "socket.io-client"
import { get, writable } from "svelte/store"
import { SocketEvents } from "../../definitions/enums"
import type { ContractInformation } from "../../definitions/interfaces"
import { bamAccessKey, bamBrokerURL, bamGroup } from "../../stores/settings"

export class Tracker {
	contractId = writable<string>("")
	messages = writable<ContractInformation[]>([])
	connected = writable<boolean>(false)
	socket: Socket | null = null

	constructor() {}

	getUpdates = function () {
		console.log("Getting updates")
		const key = get(bamAccessKey)
		const group = get(bamGroup)
		const url = get(bamBrokerURL)
		// Creating the connection
		const ioConfig = {
			auth: {
				token: key,
			},
			extraHeaders: {
				"agent-type": "job",
				"group-key": group,
			},
			path: "/socket/",
		}

		this.socket = io(url, ioConfig)
			.on(SocketEvents.CONNECT, () => {
				this.connected.set(true)
				console.log("Getting contract information.")
				const id = get(this.contractId)
				this.socket.emit(SocketEvents.GET_CONTRACT, id)
				// Backup timeout to close socket on the event
				// the broker does not respond to the request.
				setTimeout(() => {
					if (this.socket) {
						this.socket.close()
						this.socket = null
						this.connected.set(false)
					}
				}, 5000)
			})
			.on(SocketEvents.CONNECT_ERROR, (err: Error) => {
				console.log(`Connection Error: ${err}`)
				if (this.socket) {
					this.socket.close()
					this.socket = null
					this.connected.set(false)
				}
			})
			.on(SocketEvents.GET_CONTRACT, (msg: ContractInformation[]) => {
				this.messages.set(msg)
				if (this.socket) {
					this.socket.close()
					this.socket = null
					this.connected.set(false)
				}
			})
			.on(SocketEvents.MESSAGE_ERROR, (msg: string) => console.log(msg))
	}
}
