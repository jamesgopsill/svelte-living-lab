import type { WebSerialPrinter } from "."

export function evalString(this: WebSerialPrinter, line: string) {
	line = line.trim()
	line = line.replace("\r", "")
	//console.log("Response:", line)

	if (line.includes("ok")) {
		// OK to process another piece of gcode
		this.ok = true
	}

	if (this.printerType == "PRUSA_MINI") {
		// Update with a regex
		if (line.startsWith("FIRMWARE_NAME")) {
			const firmware = line.match(/(?<=FIRMWARE_NAME:).*(?=SOURCE_CODE_URL)/g)
			console.log(firmware)
			this.firmware.update((_) => firmware[0].trim())

			const sourceCodeUrl = line.match(/(?<=SOURCE_CODE_URL:).*(?=PROTO)/g)
			this.sourceCodeUrl.update((_) => sourceCodeUrl[0].trim())

			const protocolVersion = line.match(
				/(?<=PROTOCOL_VERSION:).*(?=MACHINE_TYPE)/g
			)
			this.protocolVersion.update((_) => protocolVersion[0].trim())

			const machineType = line.match(/(?<=MACHINE_TYPE:).*(?=EXTRUDER_COUNT)/g)
			this.machineType.update((_) => machineType[0].trim())

			const uuid = line.match(/(?<=UUID:).*/g)
			this.uuid.update((_) => uuid[0].trim())
			return
		}

		// Temp report
		if (line.startsWith("ok T") || line.startsWith("T")) {
			const extruderTempActual = line.match(/(?<=T:).*(?=\/)/g)
			this.extruderTempActual.update((_) =>
				parseFloat(extruderTempActual[0].trim())
			)
			const extruderTempDemand = line.match(/(?<=\/).*(?=B)/g)
			this.extruderTempDemand.update((_) =>
				parseFloat(extruderTempDemand[0].trim())
			)
			const bedTempActual = line.match(/(?<=B:).*(?=\/)/g)
			this.bedTempActual.update((_) => parseFloat(bedTempActual[0].trim()))
			const bedTempDemand = line.match(/[0-9.\s]+(?=A:)/g)
			this.bedTempDemand.update((_) => parseFloat(bedTempDemand[0].trim()))
			return
		}
	}

	if (this.printerType == "PRUSA_MK3S") {
		// Update with a regex
		if (line.startsWith("FIRMWARE_NAME")) {
			const firmware = line.match(/(?<=FIRMWARE_NAME:).*(?=FIRMWARE_URL)/g)
			console.log(firmware)
			this.firmware.update((_) => firmware[0].trim())

			const sourceCodeUrl = line.match(/(?<=FIRMWARE_URL:).*(?=PROTO)/g)
			this.sourceCodeUrl.update((_) => sourceCodeUrl[0].trim())

			const protocolVersion = line.match(
				/(?<=PROTOCOL_VERSION:).*(?=MACHINE_TYPE)/g
			)
			this.protocolVersion.update((_) => protocolVersion[0].trim())

			const machineType = line.match(/(?<=MACHINE_TYPE:).*(?=EXTRUDER_COUNT)/g)
			this.machineType.update((_) => machineType[0].trim())

			const uuid = line.match(/(?<=UUID:).*/g)
			this.uuid.update((_) => uuid[0].trim())
			return
		}
	}
}

// FIRMWARE_NAME:Prusa-Firmware-Buddy 4.3.4 (Github) SOURCE_CODE_URL:https://github.com/prusa3d/Prusa-Firmware-Buddy PROTOCOL_VERSION:1.0 MACHINE_TYPE:Prusa-mini EXTRUDER_COUNT:1 UUID:cede2a2f-41a2-4748-9b12-c55c62f367ff

// ok T:21.16 /0.00 B:21.87 /0.00 A:30.67 /0.00 @:0 B@:0
