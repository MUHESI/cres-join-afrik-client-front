/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { check } from 'express-validator';

const profileRules = {
	forCreation: [
		check('user')
			.isString()
			.isMongoId()
			.withMessage('invalid_user_id'),
		check('bio')
			.isString()
			.isLength({
				min: 3
			})
			.optional()
			.withMessage('invalid_bio_value'),

		check('phoneNumber')
			.isString()
			.withMessage('Enter a valid phone number')
			.optional(),
		check('country')
			.isString()
			.isLength({
				min: 3,
			})
			.withMessage('Enter a valid country')
			.optional(),
		check('city')
			.isString()
			.isLength({
				min: 3,
			})
			.withMessage('Enter a valid city')
			.optional(),
		check('portfolio')
			.isString()
			.isURL()
			.withMessage('Enter a valid portfolio')
			.optional(),

		// check('achievements')
		//   .isArray({ min: 1 })
		//   .withMessage('You must enter at least one achievement.')
		//   .optional(),

		// check('experienceLevel')
		//   .isString()
		//   .withMessage('Enter a valid experience level')
		//   .optional(),
		check('yearsOfExperience')
			.isNumeric()
			.withMessage('invalid_number_message_yearsOfExperience')
			.optional(),
		check('availableTime')
			.isString()
			.withMessage('invalid_available_time')
			.optional(),
		check('schoolLevel')
			.isString()
			.optional()
			.withMessage('invalid_school_level'),
		check('organisation')
			.isString()
			.isMongoId()
			.withMessage('invali_organisation_id')
			.optional(),
		check('socialsMedia')
			.isArray()			
			.withMessage('Enter a valid socialsMedia')
			.optional(),
		check('languages')
			.isArray()			
			.withMessage('Enter a valid languages')
			.optional(),			
		check('skills')
			.isObject()			
			.withMessage('Enter a valid skills')
			.optional(),
		check('educationPath')
			.isArray()			
			.withMessage('Enter a valid educationPath')
			.optional(),
		check('professionalExperience')
			.isArray()			
			.withMessage('Enter a valid professionalExperience')
			.optional(),
	],

	forUpdate: [

		check('phoneNumber')
			.isString()
			.withMessage('Enter a valid phone number')
			.optional(),

		check('country')
			.isString()
			.withMessage('Enter a valid country')
			.optional(),

		check('whatsAppLink')
			.isString()
			.withMessage('Enter a valid WhatsApp link')
			.optional(),

		check('instagramLink')
			.isString()
			.withMessage('Enter a valid Instagram link')
			.optional(),

		check('twitterLink')
			.isString()
			.withMessage('Enter a valid Twitter link')
			.optional(),

		check('facebookLink')
			.isString()
			.withMessage('Enter a valid Facebook link')
			.optional(),

		check('skypeLink')
			.isString()
			.withMessage('Enter a valid Skype link')
			.optional(),

		check('telegramLink')
			.isString()
			.withMessage('Enter a valid Telegram link')
			.optional(),

		check('youtubeLink')
			.isString()
			.withMessage('Enter a valid Youtube channel link')
			.optional(),

		check('behanceLink')
			.isString()
			.withMessage('Enter a valid Behance link')
			.optional(),

		check('githubLink')
			.isString()
			.withMessage('Enter a valid Github link')
			.optional(),

		check('portfolio')
			.isString()
			.withMessage('Enter a valid portfolio')
			.optional(),

		check('resumeLink')
			.isString()
			.withMessage('Enter a valid resume link')
			.optional(),

		check('achievements')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one achievement.')
			.optional(),

		check('linkedinLink')
			.isString()
			.withMessage('Enter a valid Linkedin link')
			.optional(),

		check('schoolLevel')
			.isString()
			.optional()
			.withMessage('invalid_school_level'),

		check('experienceLevel')
			.isString()
			.withMessage('Enter a valid experience level')
			.optional(),
		check('organisation')
			.isString()
			.isMongoId()
			.withMessage('invali_organisation_id')
			.optional()
	]
};

export default profileRules;
