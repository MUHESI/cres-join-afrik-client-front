import { check } from 'express-validator';

const ratingRules = {
	forCreation: [
		// check('client')
		//     .isString()
		//     .isMongoId()
		//     .withMessage('invalid_id_format_client'),

		// check('freelancer')
		//     .isString()
		//     .withMessage('invalid_id_format_frelancer'),

		 check('postedBy')
		     .isString()
		     .withMessage('invalid_postedBy_format'),

		check('feedback')
			.isString()
			.isLength({
				min: 3,
				max: 255
			})
			.optional()
			.withMessage('short_feedback_length'),

		check('rate')
			.isFloat({ min: 1, max: 5 })
			.withMessage('invalid_rating_value'),
			check('termination')
			.isString()
			.isLength({
				min: 3,
				max: 255
			})
			.withMessage('short_termination_length'),
			check('recommendation')
			.isFloat({ min: 1, max: 5 })
			.withMessage('Enter a valid recommendation. It must be a numeric value between 1 and 10.')

	],

	forUpdate: [
		check('rate')
			.isFloat({ min: 1, max: 5 })
			.withMessage('Enter a valid rate. It must be a numeric value between 1 and 5.')
			.optional(),
		check('feedback')
			.isString()
			.isLength({
				min: 3,
				max: 255
			})
			.optional()
			.withMessage('short_feedback_length'),
			check('termination')
			.isString()
			.isLength({
				min: 3,
				max: 255
			})
			.optional()
			.withMessage('short_termination_length'),
			check('recommendation')
			.isFloat({ min: 1, max: 5 })
			.withMessage('Enter a valid recommendation. It must be a numeric value between 1 and 10.')
			.optional(),

	]
};

export default ratingRules;
