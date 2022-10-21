import type { WebSerialPrinter } from "."

export const read = async function (this: WebSerialPrinter) {
	while (true) {
		console.log("Reading the Serial Port")
		const { value, done } = await this.reader.read()
		if (done) {
			this.reader.releaseLock()
			break
		}

		if (value) {
			//console.log(value)
			//console.log("\n".indexOf(value))
			const lines = value.split("\n") // split on new line
			let linesAdded = 0
			//@ts-ignore
			this.log[this.log.length - 1] += lines.shift() // take the first and append it to the last partial line
			// add the additional elements (in case there are multiple newlines)
			for (const line of lines) {
				linesAdded += 1
				this.log.push(line)
			}
			// handle recent log entry event (note that -1 could be a partially digested command)
			// there could also be multiple lines in one message
			for (
				let i = this.log.length - (linesAdded + 1);
				i < this.log.length - 1;
				i++
			) {
				this.evalString(this.log[i])
			}
		} else {
			// no returns in the response so append to last index in log
			console.log("No carriage return in value")
			this.log[this.log.length - 1] += value
		}

		// Removing old elements over time.
		if (this.log.length > 100) {
			//console.log("Compressing Log From:", log.length)
			this.log.splice(0, this.log.length - 100)
			//console.log("Compressing Log To:", log.length)
		}
	}

	return
}
