import { Document } from 'mongoose';
import Stripe from 'stripe';

export interface IPayment extends Document {
	emailSender: string;
	date: Date;
	amount: number,
	description?: string,
}

export interface IBodyPayment extends Document {
	email: string,
	source: string,
	name?: string,
	description: string,
	address: Stripe.AddressParam,
	amount: number,
}
