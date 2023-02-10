import type { WebSerialPrinter } from "."

export async function cancelPrint(this: WebSerialPrinter) {
	this.status.update((v) => "canceling")
	console.log("CANCELLING THE PRINT")
	const resetLines = [
		"M108 ; interrupts the printer to listen for gcode",
		"G91 ; use relative positioning",
		"M104 S0 ; Turn off extruder heater",
		"M140 S0 ; Turn off bed heater",
		"G1 X0 Y0 Z20 F1000 ; park print head",
		"M107 ; Turn off fan",
		"M84 ; disable motors",
	]
	this.ok = true
	for (const line of resetLines) {
		while (true) {
			if (this.ok) {
				console.log("Canceling:", line)
				this.writer.write(line + "\n")
				this.ok = false
				break
			}
			await this.wait(100)
		}
	}
	this.status.update((_) => "connected")
	this.cancel = false
	return
}
