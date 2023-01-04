import { Model, model, Schema } from 'mongoose';
import { IProfile } from '../../types/user';

const profileSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		require: true,
		ref: 'User'
	},
	profilesVisited: {
		type: [Schema.Types.ObjectId],
		required: false,
		ref: 'User'
	},
	jobsSaved: {
		type: [Schema.Types.ObjectId],
		required: false,
		ref: 'Job',
		default: []
	},
	languages: {
		type: [{}],
		required: false,
	},
	yearsOfExperience: {
		type: Number,
		default: 0
	},
	availableTime: {
		type: String,
		required: false,
		default: 'PART_TIME'
	},
	bio: {
		type: String
	},
	phoneNumber: {
		type: String
	},
	country: {
		type: String
	},
	city: {
		type: String
	},
	achievements: {
		type: [Schema.Types.ObjectId],
		ref: 'Job'
	},
	experienceLevel: {
		type: String,
	},
	organisation: { // ONLY FOR CLIENTS
		type: Schema.Types.ObjectId,
		ref: 'Organisation',
		required: false,
	},
	jobsCreated: {
		type: [Schema.Types.ObjectId],
		ref: 'Job',
		required: false,
		default: []
	},
	jobApplied: {
		type: [Schema.Types.ObjectId],
		ref: 'Job',
		required: false,
		default: []
	},
	jobSelected: {
		type: [Schema.Types.ObjectId],
		ref: 'Job',
		default: [],
		required: false
	},
	hourly: {
		type: Number,
		required: false,
		default: 5,
	},
	rating: {
		type: [Schema.Types.ObjectId],
		required: false,
		ref: 'Rating',
		default: [],
	},
	applications: {
		type: [Schema.Types.ObjectId],
		required: false,
		ref: 'Application',
		default: []
	},
	// ADDITIONAL FIELDS
	skills: {
		type: {},
		required: false,
	},
	professionalExperience: {
		type: [{}],
		required: false,
	},
	educationPath: {
		type: [{}],
		required: false,
	},
	socialsMedia: {
		type: [{}],
		required: false,
	},
}, {
	timestamps: true
});

const Profile: Model<IProfile> = model<IProfile>('Profile', profileSchema);

export default Profile;
