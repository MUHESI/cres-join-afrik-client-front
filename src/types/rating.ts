import { Document } from 'mongoose';

export enum FeedbackCategory {
	PRIVATE = 'PRIVATE',
	PUBLIC = 'PUBLIC',
}

export enum PostedByCategory {
	CLIENT = 'CLIENT',
	FREELANCER = 'FREELANCER',
}
export interface IRating extends Document {
	client: string;
	freelancer: string;
	rate?: number;
	feedback?: string;
	job: string;
	termination?: string;
	recommendation?: number;
	date?: Date;
	feedbackCategory?: FeedbackCategory;
	postedBy:PostedByCategory;
}
