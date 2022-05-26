import type { WebSerialPrinter } from "."

export const connect = async function(this: WebSerialPrinter) {
	if (!("serial" in navigator)) {
		alert("This browser does not support Web Serial.")
		return
	}

	// Request the serial port
	//@ts-ignore 
	this.port = await navigator.serial
	.requestPort()
	.catch((err: any) => console.log(err))

	await this.port.open({ baudRate: this.baud })

	const decoder = new TextDecoderStream()
	this.readableStreamClosed = this.port.readable.pipeTo(decoder.writable)
	const inputStream = decoder.readable
	this.reader = inputStream.getReader()

	this.read()

	const encoder = new TextEncoderStream()
	this.writableStreamClosed = encoder.readable.pipeTo(this.port.writable)
	this.writer = encoder.writable.getWriter()

	// Get firmware details
	await this.writer.write("M115\n")
	await this.writer.write("M105\n")

	this.status.update(v => "connected")
	this.isConnected = true
}