import { Model, model, Schema } from 'mongoose';
import { IService } from '../../types/Service';

const serviceSchema: Schema = new Schema({
	iconUrl: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: false,
	}
});

const Service: Model<IService> = model<IService>('Service', serviceSchema);
export default Service;
