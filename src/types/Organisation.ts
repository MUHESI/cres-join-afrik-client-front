import { Document } from 'mongoose';
// import { IJob } from './job.d';
// import { IUser } from './user';

export interface IOrganisation extends Document {
	fields: string[];
	certified?: boolean;
	clients: string[];
	jobs: string[];
	label: string;
	website?: string;
	githubLink?: string;
}
