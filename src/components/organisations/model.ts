import { Model, model, Schema } from 'mongoose';
import { IOrganisation } from '../../types/Organisation';

const organisationSchema: Schema = new Schema({
	label: {
		type: String,
		required: true,
		unique: true,
	},
	fields: {
		type: [String],
		required: true
	},
	githubLink: {
		type: String,
		unique: true,
	},
	website: {
		tppe: String,
	},
	certified: {
		type: Boolean,
		default: false
	},
	clients: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User' // ONLY USERS WITH CLIENT ROLE
		}
	],
	jobs: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Job'
		}
	]
});

const Organisation: Model<IOrganisation> = model<IOrganisation>('Organisation', organisationSchema);

export default Organisation;
