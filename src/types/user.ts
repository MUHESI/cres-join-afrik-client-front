/* eslint-disable  no-use-before-define */
/* eslint-disable  import/no-cycle */

import { Document } from 'mongoose';
import { IJob } from './job';
import { IRating } from './rating';

export enum Roles {
	SUPERADMIN = 'SUPERADMIN',
	ADMIN = 'ADMIN',
	CLIENT = 'CLIENT',
	DEVELOPPER = 'DEVELOPPER',
	FREELANCER = 'FREELANCER'
}

export enum Languages {
	FRENCH = 'FRENCH',
	ENGLISH = 'ENGLISH',
	SPANISH = 'SPANISH',
}

export enum Domains{
	MARKETING = 'MARKETING',
	PROGRAMMING = 'PROGRAMMING',
	DESIGN = 'DESIGN',
	TECHNICAL = 'TECHNICAL',

}
export interface ISkills{
	domain: Domains;
	skills: string[];
}

export enum LevelLanguage{
	BEST = 'BEST',
	GOOD = 'GOOD',
	MIDDLE = 'MIDDLE',
}

export enum Sex {
	M = 'M',
	F = 'F',
	B = 'B',
	N = 'N'
}

export enum Availability {
	PART_TIME = 'PART_TIME',
	FULL_TIME = 'FULL_TIME',
}
export interface ILanguages {
	level: LevelLanguage;
	language:Languages;
 }

export interface IBasicUser extends Document {
	id?: string;
	email: string;
	password: string;
	role: string;
}

export interface IPeriodExperience {
	month: string;
	year: string;
}

export interface IProfessionalExperience {
	role: string;
	company: string;
	description?: string;
	achievements?: string[];
	startedDate?: IPeriodExperience;
	endDate?: IPeriodExperience | null;
	city: string;
	country: string;
	isCurrentWork: boolean;


}

export interface IEducationPath {
	institution: string;
	domainOfStudy?: string;
	startedDate: IPeriodExperience;
	endDate?: IPeriodExperience | null;
	description: string;
	city: string;
	country: string;
	learningInProgress: boolean;

}
export interface ISocialsMedia{
	label: string;
	link: string;
}

export interface IProfile extends Document {
	user: string;
	bio?: string;
	phoneNumber?: string;
	country?: string;
	city?: string;
	achievements?: IJob[];
	profilesVisited?: IUser[];
	rates?: Array<number>;
	experienceLevel?: string;
	jobSelected?: IJob[];
	jobApplied?: IJob[];
	schoolLevel?: string;
	availableTime?: Availability;
	yearsOfExperience?: number;
	// ONLY FOR CLIENTS
	jobsCreated?: IJob[];
	organisation?: string;
	// FOR JOBS SAVED
	jobsSaved?: string[];
	// ADDITIONAL FIELDS FOR FREELANCERS
	hourly?: number;
	rating?: Array<IRating>;
	applications?: [string];

	// ADDITIONAL INFORMATIONS
	professionalExperience?: IProfessionalExperience[];
	educationPath?: IEducationPath[];
	socialsMedia: ISocialsMedia[];
	languages?: ILanguages[];
	skills: ISkills;


}

export interface IUser extends IBasicUser {
	fName?: string;
	profile?: IProfile;
	active?: boolean;
	confirmationCode?: string;
	jobs?: string[];
	lName?: string;
	avatar?: string;
	username?: string;
	roles?: Roles[];
	country?: string;
	languages?: Languages[];
	dateOfBirth?: Date;
	bio?: string;
	sex: Sex;
}
