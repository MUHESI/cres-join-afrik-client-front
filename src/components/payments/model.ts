import { Model, model, Schema } from 'mongoose';
import { IPayment } from '../../types/payment';

const paymentSchema: Schema = new Schema({
	emailSender: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
		default: new Date()
	},
	amount: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: false,
	},
});

const Payment: Model<IPayment> = model<IPayment>('Paymnent', paymentSchema);

export default Payment;
