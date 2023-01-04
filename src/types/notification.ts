// import { Document } from 'mongoose';

export enum Destinations {
	ALL = 'ALL'
}

export enum StatusValues {
	SEEN = 'SEEN',
	UNSEEN = 'UNSEEN'
}

export interface INotification {
	title: string;
	content: string;
	source: string;
	destination: Destinations;
	status: StatusValues;
}
