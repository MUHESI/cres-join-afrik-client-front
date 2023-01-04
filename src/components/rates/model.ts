import { Model, model, Schema } from 'mongoose';
import { IRating } from '../../types/rating';

const ratingSchema: Schema = new Schema({
	client: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	freelancer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	rate: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	job: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	feedback: {
		type: String,
		required: false,
	},
	termination: {
		type: String,
		required: false,
	},
	recommendation: {
		type: Number,
		min: 1,
		max: 10,
		required: false,
	},
	date: {
		type: Date,
		default: new Date()
	},
	feedbackCategory: {
		type: String,
		required: false,
		default: 'PUBLIC'
	},
		postedBy: {
		type: String,
		required: true,
	}
}, {
	timestamps: true
});

const Rating: Model<IRating> = model<IRating>('Rating', ratingSchema);

export default Rating;
