import { Model, model, Schema } from 'mongoose';
import { ICorrection } from '../../types/job';

const correctionSchema: Schema = new Schema({
	milestone: {
		type: String,
		required: true,
	},
	deadlineDays: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: new Date(),
		required: false,
	},
	document: {
		type: [String],
		required: false,
	},
	job: {
		type: Schema.Types.ObjectId,
		ref: 'job',
		required: true,
	},
	status: {
		type: String,
		required: false,
		default: 'ONGOING',
	},
	message: {
		type: String,
		required: false,
	}
}, {
	timestamps: true,
});

const Correction: Model<ICorrection> = model<ICorrection>('correction', correctionSchema);
export default Correction;
