import type { WebSerialPrinter } from "."

export async function read(this: WebSerialPrinter) {
	while (true) {
		// console.log("Reading the Serial Port")
		const { value, done } = await this.reader.read()
		if (done) {
			this.reader.releaseLock()
			break
		}

		console.log(`Read: ${value}`)
		this.evalString(value)
		this.log.push(value)
		// Remove old elements over time
		if (this.log.length > 50) this.log.shift()
	}

	return
}
