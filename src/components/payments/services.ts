import config from 'config';
import Stripe from 'stripe';
import { IPayment, IBodyPayment } from '../../types/payment';
import Payment from './model';

export default class PaymentServices {
	private static _stripePublishedKey: string = config.get('stripePublishedKey') || '';

	private stripeSecretKey: string = config.get('stripeSecretKey') || '';

	private stripe = new Stripe(this.stripeSecretKey, {
		apiVersion: '2020-08-27',
	});

	static get stripePublishedKey(): string {
		return PaymentServices._stripePublishedKey;
	}

	async openPayment({
		email,
		source,
		name,
		description,
		address,
		amount,
	}: IBodyPayment): Promise<{
		hasError: boolean;
		data: {
			charge: Stripe.Response<Stripe.Charge>;
			payment: IPayment;
		};
		message: string;
	}> {
		try {
			const createCustomer = async () => {
				const params: Stripe.CustomerCreateParams = {
					email,
					source,
					name,
					address,
				};

				const customer: Stripe.Customer = await this.stripe.customers.create(params);
				return customer;
			};
			const client = await createCustomer();
			const charge = await this.stripe.charges.create({
				amount,
				description,
				currency: 'USD',
				customer: client.id,
			});
			// CREATE A TRANSACTION IN THE DATABASE
			const payment = await Payment.create({
				emailSender: email,
				description,
				date: new Date(),
				amount,
			});

			if (charge && payment) return { hasError: false, data: { charge, payment }, message: 'Transaction succeeded' };
			return { hasError: true, data: { charge, payment }, message: 'An error occured' };
		} catch (error) {
			return {
				data: null,
				hasError: true,
				message: `${error}`,
			};
		}
	}
};
