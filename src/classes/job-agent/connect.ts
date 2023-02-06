import io from "socket.io-client"
import type { JobAgent } from "."
import { SocketEvents } from "../../definitions/enums"
import { handleAllJobsMessage } from "./handle-all-jobs-message"
import { handleConnect } from "./handle-connect"
import { handleConnectionError } from "./handle-connection-error"
import { handleDirectMessage } from "./handle-direct-message"
import { bamAccessKey, bamBrokerURL, bamGroup } from "../../stores/settings"
import { get } from "svelte/store"

export function connect(this: JobAgent) {
	console.log("Connecting to BAM")
	let isThereGCode = false
	for (const [_, value] of Object.entries(this.gcode)) {
		if (value) isThereGCode = true
	}
	if (!isThereGCode) {
		console.log("No gcode present")
		return
	}

	this.messages.update((u) => {
		u.push(`${new Date().toISOString()}: Connecting to BAM`)
		return u
	})

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
		.on(SocketEvents.CONNECT, handleConnect.bind(this))
		.on(SocketEvents.CONNECT_ERROR, handleConnectionError.bind(this))
		.on(SocketEvents.MESSAGE_ERROR, (msg: string) => console.log(msg))
		.on(SocketEvents.ALL_JOBS, handleAllJobsMessage.bind(this))
		.on(SocketEvents.DIRECT, handleDirectMessage.bind(this))
}
