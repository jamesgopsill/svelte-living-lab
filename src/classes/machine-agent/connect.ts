import { io } from "socket.io-client"
import { get } from "svelte/store"
import type { MachineAgent } from "."
import { SocketEvents } from "../../definitions/enums"
import { bamAccessKey, bamBrokerURL, bamGroup } from "../../stores/settings"
import { handleConnect } from "./handle-connect"
import { handleConnectionError } from "./handle-connection-error"
import { handleDirectMessage } from "./handle-direct-message"

export function connect(this: MachineAgent) {
	const key = get(bamAccessKey)
	const group = get(bamGroup)
	const url = get(bamBrokerURL)

	if (!key || !url || !group) {
		return
	}

	const ioConfig = {
		auth: {
			token: key,
		},
		extraHeaders: {
			"agent-type": "machine",
			"group-key": group,
		},
		path: "/socket/",
	}
	this.socket = io(url, ioConfig)
		.on(SocketEvents.CONNECT, handleConnect.bind(this))
		.on(SocketEvents.CONNECT_ERROR, handleConnectionError.bind(this))
		.on(SocketEvents.MESSAGE_ERROR, (msg: string) => console.log(msg))
		.on(SocketEvents.DIRECT, handleDirectMessage.bind(this))
}
