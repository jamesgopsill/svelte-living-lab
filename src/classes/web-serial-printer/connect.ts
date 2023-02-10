import type { WebSerialPrinter } from "."
import { LineBreakTransformer } from "./line-break-transformer"

export async function connect(this: WebSerialPrinter) {
	if (!("serial" in navigator)) {
		alert("This browser does not support Web Serial.")
		return
	}

	// Request the serial port
	this.port = await navigator.serial
		//@ts-ignore
		.requestPort()
		.catch((err: any) => console.log(err))

	await this.port.open({ baudRate: this.baud })

	const textDecoder = new TextDecoderStream()
	this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable)
	//const inputStream = decoder.readable
	//this.reader = inputStream.getReader()
	const reader = textDecoder.readable
		.pipeThrough(new TransformStream(new LineBreakTransformer()))
		.getReader()
	this.reader = reader

	this.read()

	const encoder = new TextEncoderStream()
	this.writableStreamClosed = encoder.readable.pipeTo(this.port.writable)
	this.writer = encoder.writable.getWriter()

	// Get firmware details
	if (this.printerType == "PRUSA_MINI") {
		await this.writer.write("M115\n")
		if (this.ok) {
			console.log("M155 call")
			await this.writer.write("M155 S1\n")
		}
	}

	if (this.printerType == "PRUSA_MK3S") {
		await this.writer.write("M115\n")
		//console.log("Prusa MK3S commands")
		/*
		setTimeout(async () => {
			console.log("Prusa MK3S commands")
			await this.writer.write("M115\n")
		}, 2000)
		*/
	}

	this.status.update((v) => "connected")
	this.isConnected = true
}
