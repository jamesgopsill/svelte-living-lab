/**
 * The format of a message coming to the broker.
 */
export interface Message {
	fromId: string
	toId: string
	subject: string
	body: any
}

/**
 * The format of a progress update request.
 */
 export interface ProgressUpdate {
	transactionId: string
	status: string
}

export interface TransactionHistory {
	createdAt: Date,
	status: string
}