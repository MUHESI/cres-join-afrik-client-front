import { check } from 'express-validator';
import { ApplicationStatus } from '../../types/application';

const ApplicationRules = {
	forApplication: [
		check('hourlyRate')
			.isNumeric()
			.withMessage('invalid_hourly_rate_value'),
		check('timeOfExecution')
			.isNumeric()
			.withMessage('invalid_timeOfExecution_value'),
		check('notes')
			.isString()
			.isLength({ min: 10, max: 255 })
			.withMessage('notes_lenght_not_admissible')
			.optional(),
		check('milestones')
			.isArray()
			.withMessage('milestones_shouldbe_stringufied')
	],
	forUpdate: [
		check('hourlyRate')
			.isNumeric()
			.optional()
			.withMessage('invalid_hourly_rate_value'),
		check('timeOfExecution')
			.isNumeric()
			.optional()
			.withMessage('invalid_timeOfExecution_value'),
		check('notes')
			.isString()
			.isLength({ min: 10, max: 255 })
			.withMessage('notes_lenght_not_admissible')
			.optional(),
		check('milestones')
			.isArray()
			.optional()
			.withMessage('milestones_shouldbe_stringufied'),
		check('status')
			.isString()
			.isIn([
				ApplicationStatus.ONGOING,
				ApplicationStatus.ACCEPTED,
				ApplicationStatus.REJECTED
			])
			.withMessage('invalid_applicationStatus'),
	]
};

export default ApplicationRules;
