import type { WebSerialPrinter } from "."

export const sendGcode = async function(this: WebSerialPrinter, gcode: string[]) {
	for (const line of gcode) {
		if (!line.startsWith(";") && line) {
			// Ignore the comments
			while (true) {
				if (this.cancel) break // exit loop
				// If ok to send then send the command
				if (this.ok) {
					console.log("Sending:", line)
					this.writer.write(line + "\n")
					this.ok = false
					break // breaks the while loop
				}
				await this.wait(10) // wait 10ms and hope the printer comes back with an ok
			}
		}
	}
}