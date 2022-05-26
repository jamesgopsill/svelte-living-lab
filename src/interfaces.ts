/**
 * The format of a message coming to the broker.
 */
export interface Message {
	fromId: string
	toId: string
	subject: string
	body: any
}
