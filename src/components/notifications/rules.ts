import { check } from 'express-validator';

export const notificationRules = [
	check('title')
		.isString()
		.withMessage('Enter the valid title.'),

	check('content')
		.isString()
		.withMessage('Enter the valid content.'),

	check('source')
		.exists({ checkNull: true })
		.withMessage('Please enter the source ID.'),

	check('destination')
		.optional()
		.isString()
		.withMessage('Enter the valid destination value.'),

	check('status')
		.optional()
		.isString()
		.withMessage('Enter the valid destination value.'),
];

export const notificationRulesUpdate = [
	check('title')
		.optional()
		.isString()
		.withMessage('Enter the valid title.'),

	check('content')
		.optional()
		.isString()
		.withMessage('Enter the valid content.'),

	check('source')
		.optional()
		.exists({ checkNull: true })
		.withMessage('Please enter the source ID.'),

	check('destination')
		.optional()
		.isString()
		.withMessage('Enter the valid destination value.'),

	check('status')
		.optional()
		.isString()
		.withMessage('Enter the valid status value.'),
];

export const notificationRulesStatus = [
	check('status')
		.isString()
		.withMessage('Enter the valid status value.'),
];
