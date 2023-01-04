import { Model, model, Schema } from 'mongoose';
import { Destinations, INotification, StatusValues } from '../../types/notification';

const notificationSchema: Schema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	source: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	destination: {
		type: String,
		default: Destinations.ALL
	},
	status: {
		type: String,
		default: StatusValues.UNSEEN
	}
}, {
	timestamps: true
});

const Notification: Model<INotification> = model<INotification>('Notification', notificationSchema);

export default Notification;
