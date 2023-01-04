/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { check } from 'express-validator';
import Service from './model';

const serviceRules = {
	forCreation: [
		check('iconUrl')
			.isURL()
			.withMessage('Invalid icon Url'),
		check('label')
			.isString()
			.isLength({ min: 3 })
			.withMessage('The length of the label is short')
			.custom(label => Service.findOne({ label }).then(l => !l))
			.withMessage('Duplicated service label'),
		check('description')
			.isString()
			.isLength({ min: 3 })
			.withMessage('The length of the label is short')
			.optional()
		// .custom(label => Service.findOne({ label }).then(l => !l))
		// .withMessage('Duplicated service label')
	]
};

export default serviceRules;
