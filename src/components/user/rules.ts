/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt';
import { check } from 'express-validator';
import User from './model';

const userRules = {
	forRegister: [
		check('email')
			.isEmail()
			.withMessage('Invalid email format')
			.custom(email => User.findOne({ email }).then(u => !u))
			.withMessage('Email exists')
			.optional(),
		check('password')
			.isLength({ min: 8 })
			.withMessage('Invalid password'),
		check('confirmPassword')
			.custom((confirmPassword, { req }) => req.body.password === confirmPassword)
			.withMessage('Passwords are different'),
		check('role')
			.isString() // by default a freelancer
			.withMessage('Enter a valid role')
			.optional()
	],
	forRecoverPassword: [
		check('email')
			.isEmail()
			.withMessage('Invalid email format')
			.custom((email, { req }) => User.findOne({ email: req.body.email }).then(u => !!u))
			.withMessage('This user doesn\'t exist, make sure you have an account'),
	],
	forResetPassword: [
		check('newPassword')
			.isLength({ min: 8 })
			.withMessage('Invalid password'),
		check('currentPassword')
			.isLength({ min: 8 })
			.withMessage('Invalid password'),
	],
	forLogin: [
		check('email')
			.isEmail()
			.withMessage('Invalid email format')
			.custom((email, { req }) => User.findOne({ email: req.body.email }).then(u => !!u))
			.withMessage('Invalid email or password'),
		check('password')
			.custom((password, { req }) => User.findOne({ email: req.body.email })
				.then(u => bcrypt.compare(password, u!.password)))
			.withMessage('Invalid email or password')
	],
	forCompleteSignup: [
		// check('email')
		//   .isEmail()
		//   .withMessage('Invalid email format'),
		check('fName')
			.isString()
			.isLength({ min: 3 })
			.withMessage('Put a name with length greater or equal to 3'),
		check('lName')
			.isString()
			.isLength({ min: 3 })
			.withMessage('Put a name with length greater or equal to 3')
			.optional(),
		/* check('dateOfBirth')
			.isDate({ format: 'DD-MM-YYYY' })
			.withMessage('Enter a correct date in the DD-MM-YYYY format')
			.optional(), */
		check('languages')
			.isArray({ min: 1 })
			.withMessage('Select at least one language you speak in')
			.optional(),
		check('country')
			.isString()
			.withMessage('Reveal where you leave'),
		check('bio')
			.isString()
			.withMessage('Please enter a valid bio')
			.optional(),
		check('avatar')
			.isString()
			.isURL()
			.withMessage('Upload a valid url')
			.optional(),
		check('sex')
			.isString()
			.isLength({ min: 1, max: 1 })
			.withMessage('invali_sex_value')
			.optional(),
	]
};

export default userRules;
