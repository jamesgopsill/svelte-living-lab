// https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi

import { writable } from "svelte/store"
import { MachineJobStates, MachineTypes } from "../definitions/enums"

const storedBamAccessKey = localStorage.bamAccessKey

export const bamAccessKey = writable<string>(storedBamAccessKey || "")

bamAccessKey.subscribe((value: string) => {
	localStorage.bamAccessKey = value
})

// ############

const storedBamGroup = localStorage.bamGroup

export const bamGroup = writable<string>(storedBamGroup || "")

bamGroup.subscribe((value: string) => {
	localStorage.bamGroup = value
})

// ############

const storedBamBrokerURL = localStorage.bamBrokerURL

export const bamBrokerURL = writable<string>(storedBamBrokerURL || "")

bamBrokerURL.subscribe((value: string) => {
	localStorage.bamBrokerURL = value
})
