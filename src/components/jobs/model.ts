/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, model, Schema } from 'mongoose';

const jobSchema: Schema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	experienceLevel: {
		type: String,
		required: true
	},
	yearsOfExperience: {
		type: Number,
		required: false,
	},
	availableTime: {
		type: String,
		required: false,
	},
	languages: [
		{
			type: String
		}
	],
	skills: [
		{
			type: String
		}
	],
	country: {
		type: String
	},
	isFinished: {
		type: Boolean,
		default: false
	},
	client: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	numberOfDevs: {
		type: Number,
		default: 1
	},
	budget: {
		type: Number,
		required: true
	},
	tasks: {
		type: [String],
		required: false,
	},
	requirements: {
		type: [String],
		required: false,
	},
	coverImage: {
		type: String,
		default: 'https://relevant.software/wp-content/uploads/2020/05/photo-1571857089544-64fc3877749d.jpeg',
	},
	dueAt: {
		type: Date,
		required: true,
	},
	selectedFreelancers: {
		type: [Schema.Types.ObjectId],
		ref: 'Profile',
		required: false,
		default: []
	},
	applications: {
		type: [Schema.Types.ObjectId],
		ref: 'Application',
		required: false,
		default: []
	},
	paymentMode: {
		type: String,
		required: false,
		default: 'BANK'
	},
	status: {
		type: String,
		required: false,
		default: 'CREATED',
	},
	documents: {
		type: [String],
		required: false,
		default: [],
	},
	typeProject:{
		type: String,
		required: false,
	 }
}, {
	timestamps: true,
});

// const Job: Model<IJob> = model('Job', jobSchema);
const Job: Model<any> = model<any>('Job', jobSchema);

export default Job;
