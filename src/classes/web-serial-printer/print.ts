import type { WebSerialPrinter } from "."

export async function print(this: WebSerialPrinter, gcode: string) {
	// pause requesting for updates
	console.log("Starting Test Print")
	this.status.update((v) => "printing")

	let gcodeLines = gcode.split("\n")
	for (const line of gcodeLines) {
		if (this.cancel) break // exit loop
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

	if (this.cancel) {
		this.cancelPrint()
	} else {
		this.status.update((v) => "connected")
		console.log("Serial Print Complete")
	}
}
