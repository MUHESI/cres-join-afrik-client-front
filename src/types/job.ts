/* eslint-disable  import/no-cycle */
import { Availability, IProfile } from './user';

export { Document } from 'mongoose';

export enum JobFields {
	MOBILE = 'MOBILE',
	WEB = 'WEB',
	DESIGN = 'DESIGN',
	DESKTOP = 'DESKTOP',
	NETWORK = 'NETWORK'
}

export enum JobStatuses {
	ONGOING = 'ONGOING',
	CANCELED = 'CANCELED',
	DELETED = 'DELETED',
	INREVIEW = 'INREVIEW',
	COMPLETED = 'COMPLETED',
	NOSTARTED = 'NOSTARTED',
	CREATED = 'CREATED'
}

export enum CorrectionStatus {
	COMPLETED = 'COMPLETED',
	ONGOING = 'ONGOING',
	AWAITING = 'AWAITING',
	INREVIEW = 'INREVIEW'
}

export enum MilestoneStatuses {
	ONGOING = 'ONGOING',
	COMPLETED = 'COMPLETED',
	INREVIEW = 'INREVIEW',
	DELETED = 'DELETED'
}

export interface ICategoryJob {
	web: string[];
	mobile: string[];
	design: string[];
	devops: string[];
	desktop: string[];
}

export enum PaymentMode {
	BANK = 'BANK',
	CREDIT = 'CREDIT',
	MOBILE = 'MOBILE',
}
export enum TypeProject {
	PER_HOUR = 'PER_HOUR',
	FLAT_RATE = 'FLAT_RATE',
}

export interface IStatusJob extends Document {
	status: JobStatuses;
}

export interface IJob extends Document {
	title: string;
	description: string;
	fields?: [string];
	price: number;
	duration: number;
	experienceLevel: string;
	yearsOfExperience?: number;
	languages: [string] | string;
	skills: [string] | string;
	country: string;
	isFinished: boolean;
	dueAt: Date;
	numberOfDevs: number;
	client: string;
	budget: number;
	coverImage: string;
	requirements?: string[];
	tasks?: string;
	availableTime?: Availability;
	selectedFreelancers?: Array<IProfile>;
	applications?: Array<IProfile>;
	paymentMode?: PaymentMode;
	status: JobStatuses;
	documents?: string[];
	typeProject?: TypeProject;
	createdAt?: Date;
}

export interface IMilestone extends Document {
	label: string;
	rates: number;
	message: string;
	document: string[];
	status: MilestoneStatuses;
	deadline: Date;
}


export interface ICorrection extends Document {
	milestone: string;
	deadlineDays: number;
	date?: Date;
	document?: string[];
	// document?: string;
	status: CorrectionStatus;
	job: string;
	message?: string;
}
export interface IInviteFreelancer {
	idFreelancer: string;
	idClient: string;
	idJob: string;

}
