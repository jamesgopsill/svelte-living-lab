/**
 * The format of a message coming to the broker.
 */
export interface AllMessage {
	from: string
	subject: string
	body: { [key: string]: any }
	extra: {
		thread: string
	}
}

export interface DirectMessage extends AllMessage {
	to: string
}

/**
 * The format of a progress update request.
 */
export interface ContractEntry {
	id: string
	msg: string
}

export interface ContractInformation {
	from: string
	msg: string
	date: string
}
