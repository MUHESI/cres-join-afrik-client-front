import { Model, model, Schema } from 'mongoose';
import { IUser } from '../../types/user';

/**
 * Interface to model the User Schema.
 * @param email:string [required]
 * @param password:string [required]
 * @param avatar:string [optional]
 */

const userSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String
	},
	fName: {
		type: String,
	},
	lName: {
		type: String
	},
	roles: {
		type: [String],
	},
	active: {
		type: Boolean,
	},
	confirmationCode: {
		type: String,
	},
	jobs: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Job',
		}
	],
	verified: {
		type: Boolean,
	},
	profesionalProfile: {
		type: Schema.Types.ObjectId,
		ref: 'Profile',
	},
	dateOfBirth: {
		type: Date,
	},
	languages: {
		type: [{}],
		required: false,
	},
	bio: {
		type: String
	},
	sex: {
		type: String
	}
});

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
