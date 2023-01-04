/* eslint-disable  @typescript-eslint/no-unused-vars */
import { check } from 'express-validator';

const correctionRules = {
	forCreation: [
		check('milestone')
			.isString()
			.withMessage('wrong_milestone_entered'),
		check('deadlineDays')
			.isNumeric()
			.isLength({ min: 1 })
			.withMessage('invalid_dedaline'),
		check('job')
			.isString()
			.isMongoId()
			.withMessage('incorrect_mongodb_id'),
		check('document')
			.isArray()
			.optional()
			.withMessage('invalid_document_file'),

		check('message')
			.isString()
			.withMessage('invalid_message')
			.optional()
	],
	forUpdate: [
		check('status')
			.isString()
			.withMessage('invalid_correction_status'),
		check('deadline')
			.isNumeric()
			.isLength({ min: 1 })
			.withMessage('invalid_deadline_error_update')
			.optional()
	]
};

export default correctionRules;
