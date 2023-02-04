export enum SocketEvents {
	DISCONNECT = "disconnect",
	DIRECT = "direct",
	ALL_MACHINES = "all_machines",
	ALL_JOBS = "all_jobs",
	MESSAGE_ERROR = "message_error",
	CONNECT = "connect",
	CONNECT_ERROR = "connect_error",
	POST_CONTRACT = "post_contract",
	GET_CONTRACT = "get_contract",
}

export enum AgentTypes {
	MACHINE = "machine",
	JOB = "job",
}

export enum MachineTypes {
	PRUSA_MINI = "PRUSA_MINI",
	PRUSA_MK3S = "PRUSA_MK3S",
	UM3E = "UM3E",
	UMS3 = "UMS3",
	DUMMY = "DUMMY",
}

export enum MachineConnectionTypes {
	ULTIMAKER_API = "ULTIMAKER_API",
	USB = "USB",
	OCTOPRINT = "OCTOPRINT",
	DUMMY = "DUMMY",
	MANUAL = "MANUAL",
}

export enum JobStates {
	AVAILABLE = "available",
	SELECTED = "selected",
	NOT_ONLINE = "not_online",
}

export enum MessageSubjects {
	JOB_IS_AVAILABLE = "job_is_available",
	MACHINE_IS_LOOKING_FOR_JOBS = "machine_is_looking_for_jobs",
	MACHINE_HAS_CHOSEN_A_JOB = "machine_has_chosen_a_job",
	JOB_HAS_ACCEPTED_MACHINES_OFFER = "job_has_accepted_machines_offer",
	JOB_HAS_DECLINED_MACHINES_OFFER = "job_has_declined_machines_offer",
	CONTRACT_ID = "contract_id",
}

export enum MachineStates {
	IDLE = "idle",
	OFFLINE = "offline",
	PRINTING = "printing",
}

export enum MachineJobStates {
	NULL = "null",
	PRINTING = "printing",
	COMPLETE = "complete",
	QUEUED = "queued",
}
