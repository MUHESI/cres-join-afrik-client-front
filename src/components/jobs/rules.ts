/* eslint-disable  @typescript-eslint/no-unused-vars */
import { check } from 'express-validator';

const jobRules = {
	forCreation: [
		check('title')
			.isString()
			.isLength({ min: 3, max: 50 })
			.withMessage('Enter a valid project title.'),

		check('description')
			.isString()
			.isLength({ min: 3 })
			.withMessage('Enter a valid project description.'),

		check('price')
			.isNumeric()
			.withMessage('The price must be numeric.'),

		check('duration')
			.isNumeric()
			.withMessage('The duration must be numeric.'),

		check('experienceLevel')
			.isString()
			.withMessage('Enter the the valid experience level.'),
		check('yearsOfExperience')
			.isNumeric()
			.withMessage('invalid_number_message_yearsOfExperience'),
		check('availableTime')
			.isString()
			.withMessage('invalid_value_message_availableTime'),

		 check('languages')
		 	.isArray({ min: 1 })
		 	.withMessage('You must enter at least one programming language.'),

		check('skills')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one skill.'),

		check('country')
			.isString()
			.withMessage('Enter a valid country.'),

		check('numberOfDevs')
			.isNumeric()
			.isLength({ min: 1 })
			.withMessage('Specify the number of freelacer you are looking for'),

		check('dueAt')
			.isDate({ format: 'MM-DD-YYYY' }) // 12-31-2021
			.optional()
			.withMessage('Enter a correct date in the DD-MM-YYYY format'),

		check('client')
			.isMongoId()
			.withMessage('Enter a valid Id'),

		check('budget')
			.isNumeric()
			.withMessage('Enter a valid budget'),

		check('coverImage')
			.isString()
			.withMessage('Enter a valid cover image')
			.optional(),
		check('requirements')
			.isArray()
			.withMessage('wrong_requirements_data')
			.optional(),
		check('tasks')
			.isArray()
			.isLength({ min: 3 })
			.withMessage('invalid_task'),
		check('paymentMode')
			.isString()
			.optional()
			.withMessage('invalid_paymentMode_value'),
		check('documents')
			.isArray()
			.optional()
			.withMessage('documents_should_be_array_type'),
		check('typeProject')
			.isString()
			.optional()
			.withMessage('invalid_typeProject_value')

	],
	forUpdate: [
		check('title')
			.isString()
			.isLength({ min: 3, max: 25 })
			.withMessage('Enter a valid project title.')
			.optional(),

		check('description')
			.isString()
			.isLength({ min: 3 })
			.withMessage('Enter a valid project description.')
			.optional(),

		check('status')
			.isString()
			.isLength({ min: 4 })
			.withMessage('invalid_job_status')
			.optional(),

		check('price')
			.isNumeric()
			.withMessage('The price must be numeric.')
			.optional(),

		check('duration')
			.isNumeric()
			.withMessage('The duration must be numeric.')
			.optional(),

		check('experienceLevel')
			.isString()
			.withMessage('Enter the the valid experience level.')
			.optional(),

		check('languages')
			.exists({ checkNull: true })
			.withMessage('You must enter at least one programming language.')
			.optional(),

		check('skills')
			.exists({ checkNull: true })
			.withMessage('You must enter at least one skill.')
			.optional(),

		check('country')
			.isString()
			.withMessage('Enter a valid country.')
			.optional(),

		check('numberOfDevs')
			.isNumeric()
			.isLength({ min: 1 })
			.withMessage('Specify the number of freelacer you are looking for')
			.optional(),

		check('budget')
			.isNumeric()
			.withMessage('Enter a valid budget')
			.optional(),

		check('coverImage')
			.isString()
			.withMessage('Enter a valid cover image')
			.optional(),

		// check('dueAt')
		//     .isDate({ format: 'DD-MM-YYYY' })
		//     .withMessage('Enter a correct date in the DD-MM-YYYY format')
		//     .optional(),
	]
};

export default jobRules;
