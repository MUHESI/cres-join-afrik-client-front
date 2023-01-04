import { check } from 'express-validator';

const paymentRules = {
	forPayment: [
		check('email')
			.isString()
			.isEmail()
			.withMessage('Please enter a correct email address'),
		check('source')
			.isString()
			.withMessage('Enter a correct source tokeen')
	]
};

export default paymentRules;
