import type { WebSerialPrinter } from "."

export const disconnect = async function(this: WebSerialPrinter) {

	this.reader.cancel()
	await this.readableStreamClosed.catch(() => { /* Ignore the error */ })
	
	this.writer.close()
	await this.writableStreamClosed

	this.port.close()

	this.firmware.update(v => "")
	this.sourceCodeUrl.update(v => "")
	this.status.update(v => "")
	this.protocolVersion.update(v => "")
	this.uuid.update(v => "")
	this.machineType.update(v => "")

}

// https://stackoverflow.com/questions/71262432/how-can-i-close-a-web-serial-port-that-ive-piped-through-a-transformstream