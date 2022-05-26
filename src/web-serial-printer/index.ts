import { connect } from "./connect"
import { disconnect } from "./disconnect"
import { evalString } from "./eval-string"
import { read } from "./read"
import { print } from "./print"
import { cancelPrint } from "./cancel-print"
import { writable } from "svelte/store"
import { sendGcode } from "./send-gcode"

export class WebSerialPrinter {

	// https://stackoverflow.com/questions/62884259/making-class-instance-reactive-in-svelte-using-stores
	status = writable("disconnected")
	firmware = writable("")
	sourceCodeUrl = writable("")
	uuid = writable("")
	protocolVersion = writable("")
	machineType = writable("")
	extruderTempActual = writable(0.)
	extruderTempDemand = writable(0.)
	bedTempActual = writable(0.)
	bedTempDemand = writable(0.)


	isConnected = false
	baud: number
	port: any = undefined
	writer: any = undefined
	reader: any = undefined
	ok: boolean = true
	cancel: boolean = false
	writableStreamClosed: any
	readableStreamClosed: any
	log: string[] = ["", ""]
	printerType: string

	constructor(type: string) {
		this.printerType = type
	}

	connect = connect
	disconnect = disconnect
	read = read
	evalString = evalString
	wait = (ms: number) => new Promise((r, _) => setTimeout(r, ms))
	print = print
	cancelPrint = cancelPrint
	sendGcode = sendGcode

}