import { io, type Socket } from "socket.io-client"
import type { ContractUpdate } from "../../definitions/interfaces"
import { SocketEvents } from "../../definitions/enums"
import { writable } from "svelte/store"

export class Tracker {
	contractId = writable<string>("")
	messages = writable<ContractUpdate[]>([])
	socket: Socket | null = null

	constructor() {}

	getUpdates = function (url: string, accessKey: string, group: string) {
		// Creating the connection
		const ioConfig = {
			auth: {
				token: accessKey,
			},
			extraHeaders: {
				"agent-type": "job",
				"group-key": group,
			},
			path: "/socket/",
		}
		console.log(ioConfig)

		this.socket = io(url, ioConfig)
			.on(SocketEvents.CONNECT, () => {
				this.socket.emit(SocketEvents.GET_CONTRACT, {
					id: this.contractId,
				})
				// Backup timeout to close socket on the event
				// the broker does not respond to the request.
				setTimeout(() => {
					if (this.socket) {
						this.socket.close()
						this.socket = null
					}
				}, 5000)
			})
			.on(SocketEvents.CONNECT_ERROR, (err: Error) => {
				console.log(`Connection Error: ${err}`)
				if (this.socket) {
					this.socket.close()
					this.socket = null
				}
			})
			.on(SocketEvents.GET_CONTRACT, (msg: ContractUpdate[]) => {
				this.messages.set(msg)
				if (this.socket) {
					this.socket.close()
					this.socket = null
				}
			})
			.on(SocketEvents.MESSAGE_ERROR, (msg: string) => console.log(msg))
	}
}
