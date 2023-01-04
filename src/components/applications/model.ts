import { Model, model, Schema } from 'mongoose';
import { IApplication } from '../../types/application';

const applicationSchema: Schema = new Schema({
	hourlyRate: {
		type: String,
		required: true,
	},
	timeOfExecution: {
		type: Number,
		required: true,
	},
	notes: {
		type: String,
		required: false,
	},
	milestones: {
		type: [{}],
		required: false,
	},
	job: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Job'
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	dateOfApplication: {
		type: Date,
		required: true,
		default: new Date(),
	},
	status: {
		type: String,
		required: false,
		default: 'ONGOING'
	}
	
}, {
	timestamps: true,
});

const Application: Model<IApplication> = model<IApplication>('Application', applicationSchema);

export default Application;
