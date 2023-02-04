/**
 * The format of a message coming to the broker.
 */
export interface AllMessage {
	from: string
	subject: string
	body: { [key: string]: any }
	extra: { [key: string]: any }
}

export interface DirectMessage extends AllMessage {
	to: string
}

/**
 * The format of a progress update request.
 */
export interface ContractUpdate {
	id: string
	msg: string
}
