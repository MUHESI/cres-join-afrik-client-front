export { Document } from 'mongoose';
export enum MilstoneStatus {
		ONGOING = 'ONGOING',
		COMPLETED = 'COMPLETED',
		ONREVIEW = 'ONREVIEW',
		DELETED = 'DELETED',
}

export enum ApplicationStatus {
	ONGOING = 'ONGOING',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED',
}

export type IMilestone = {
	name: string;
	amount: number;
	message?:string;
	document?:string[];
	duration:number;
	typeDuration:string;
	status: MilstoneStatus;
}

export interface IApplication extends Document {
	idApplication:string;
	hourlyRate: number;
	timeOfExecution: number; // IN HOURS
	notes?: string;
	milestones:IMilestone[];
	job: string;
	user: string;
	dateOfApplication: Date;
	status?: ApplicationStatus;
}
