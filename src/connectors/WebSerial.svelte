<script lang="ts">
	import { FormGroup, Input, Label } from "sveltestrap"
	import machine from "../stores/machine-store"

	let baudrate: number = 115200
	let connected = false
	let decoder: any
	let reader: any
	let writer: any
	let ok: boolean
	let firmware: string = ""
	let uuid: string = ""
	let files: any
	let cancelPrintFlag = false
	let status = "not connected"

	const toggle = async () => {
		console.log(connected)
		if (!connected) {
			// connect
			if (!("serial" in navigator)) {
				alert("This browser does not support Web Serial.")
				return
			}

			// Request the serial port
			//@ts-ignore 
			const port = await navigator.serial
			.requestPort()
			.catch((err: any) => console.log(err))

			status = "connecting"

			await port.open({ baudRate: baudrate })

			// Creating read loop
			console.log("Creating read loop")

			// Run read loop
			readLoop(port)

			// Configure the write stream
			const textEncoder = new TextEncoderStream()
			const writableStreamClosed = textEncoder.readable.pipeTo(port.writable)
			writer = textEncoder.writable.getWriter()

			// Get firmware details
			await writer.write("M115\n")
			status = "connected"
			
		} else {
			// disconnect
		}
	}

	const readLoop = async (port: any) => {
		
		decoder = new TextDecoderStream()
		port.readable.pipeTo(decoder.writable)

		const inputStream = decoder.readable
		reader = inputStream.getReader()

		let log: string[] = ["", ""]
		while (true) {
			console.log("Reading the Serial Port")
			const { value, done } = await reader.read()
			if (value) {
				//console.log(value)
				//console.log("\n".indexOf(value))
				const lines = value.split("\n") // split on new line
				let linesAdded = 0
				//@ts-ignore
				log[log.length - 1] += lines.shift() // take the first and append it to the last partial line
				// add the additional elements (in case there are multiple newlines)
				for (const line of lines) {
					linesAdded += 1
					log.push(line)
				}
				// handle recent log entry event (note that -1 could be a partially digested command)
				// there could also be multiple lines in one message
				for (let i = log.length - (linesAdded + 1); i < log.length - 1; i++) {
					handleResponse(log[i])
				}
			} else {
				// no returns in the response so append to last index in log
				console.log("No carriage return in value")
				log[log.length - 1] += value
			}

			// Removing old elements over time.
			if (log.length > 100) {
				//console.log("Compressing Log From:", log.length)
				log.splice(0, log.length - 100)
				//console.log("Compressing Log To:", log.length)
			}

			if (done) {
				console.log("[READING DONE]")
				reader.releaseLock()
				break
			}
		}
	}

	const handleResponse = (line: string) => {
		line = line.trim()
		line = line.replace("\r", "")
		console.log("Response:", line)

		if (line.includes("ok")) {
			// OK to process another piece of gcode
			ok = true
		}
		if (line.startsWith("FIRMWARE_NAME")) {
			let elements = line.split(" SOURCE_CODE_URL")
			firmware = (elements[0].replace("FIRMWARE_NAME:", ""))
			elements = line.split("UUID:")
			uuid = elements[1]
		}
	}

	const wait = (ms: number) => new Promise((r, j) => setTimeout(r, ms))

	const print = async (gcode: string) => {
		// pause requesting for updates
		console.log("Starting Test Print")
		status = "printing"

		let gcodeLines = gcode.split("\n")
		for (const line of gcodeLines) {
			if (cancelPrintFlag) break // exit loop
			if (!line.startsWith(";") && line) {
				// Ignore the comments
				while (true) {
					if (cancelPrintFlag) break // exit loop
					// If ok to send then send the command
					if (ok) {
						console.log("Sending:", line)
						writer.write(line + "\n")
						ok = false
						break // breaks the while loop
					}
					await wait(10) // wait 10ms and hope the printer comes back with an ok
				}
			}
		}

		if (cancelPrintFlag) {
			status = "canceling"
			console.log("CANCELLING THE PRINT")
			// Spam the printer until it listens and interrupts whatever the machine is doing
			const resetLines = [
				"M108 ; interrupts the printer to listen for gcode",
				"G91 ; use relative positioning",
				"M104 S0 ; Turn off extruder heater",
				"M140 S0 ; Turn off bed heater",
				"G1 X0 Y0 Z10 F1000 ; park print head",
				"M107 ; Turn off fan",
				"M84 ; disable motors",
			]
			ok = true
			for (const line of resetLines) {
				while (true) {
					if (ok) {
						console.log("Canceling:", line)
						writer.write(line + "\n")
						ok = false
						break
					}
					await wait(10)
				}
			}
			cancelPrintFlag = false
			return
		}

		status = "connected"
		console.log("Serial Print Complete")
	}

	$: if (files && writer) {
		const reader = new FileReader()
		reader.onload = function(event) {
			//@ts-ignore
			let g: string = event.target.result
			print(g)
			files = null
		}
		reader.readAsText(files[0])
	}

	$: if ($machine.gcode && writer) {
		$machine.available = false
		print($machine.gcode)
		$machine.gcode = ""
	}

</script>

<h4>Prusa through WebUSB (Chrome or Edge required)</h4>

<dl class="row">
	<dt class="col-sm-4">Firmware:</dt>
	<dd class="col-sm-8">{firmware}</dd>
	<dt class="col-sm-4">UUID:</dt>
	<dd class="col-sm-8">{uuid}</dd>
	<dt class="col-sm-4">Status:</dt>
	<dd class="col-sm-8">{status}</dd>
</dl>

<FormGroup>
	<Label size="sm">Baud Rate</Label>
	<Input 
		type="text" 
		bind:value={baudrate}
		invalid={!baudrate} 
		feedback="Baud Rate Required"
	/>
</FormGroup>

<FormGroup>
	<Input bind:checked={connected} on:change={toggle} type="switch" label="Toggle switch to connect/disconnect printer" />
	<Input bind:checked={cancelPrintFlag} type="switch" label="Toggle to cancel print" />
	<Input bind:checked={$machine.available} type="switch" label="Toggle to make available" />
</FormGroup>

<hr />

<FormGroup>
	<Label>Submit G-Code Directly</Label>
	<input class="form-control" type="file" bind:files />
</FormGroup>