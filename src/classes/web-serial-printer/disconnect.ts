import type { WebSerialPrinter } from "."

export async function disconnect(this: WebSerialPrinter) {
	this.reader.cancel()
	await this.readableStreamClosed.catch(() => {
		/* Ignore the error */
	})

	this.writer.close()
	await this.writableStreamClosed

	this.port.close()

	//@ts-expect-error
	if ("serial" in navigator && "forget" in SerialPort.prototype) {
		await this.port.forget()
	}

	this.firmware.update((v) => "")
	this.sourceCodeUrl.update((v) => "")
	this.status.update((v) => "")
	this.protocolVersion.update((v) => "")
	this.uuid.update((v) => "")
	this.machineType.update((v) => "")
}

// https://stackoverflow.com/questions/71262432/how-can-i-close-a-web-serial-port-that-ive-piped-through-a-transformstream
