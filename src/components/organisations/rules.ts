import { check } from 'express-validator';
import Organisation from './model';

const organisationRules = {
	forCreation: [
		check('label')
			.isString()
			.withMessage('Enter a valid label.')
			.custom((label) =>
				Organisation.findOne({ label }).then(organisation => {
					if (organisation) {
						return Promise.reject();
					}
					return {};
				})
			)
			.withMessage('Label already in use.'),

		check('fields')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one field.'),

		check('certified')
			.isBoolean()
			.withMessage('Enter a valid certification state')
			.optional(),

		check('clients')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one client.'),

		check('jobs')
			.isArray({ min: 0 })
			.withMessage('You must enter at least one job.'),

		check('website')
			.isURL()
			.withMessage('Enter a valid website URL.')
			.optional(),

		check('githubLink')
			.isURL()
			.withMessage('Enter a valid Github URL.')
			.custom((githubLink) =>
				Organisation.findOne({ githubLink }).then(organisation => {
					if (organisation) {
						return Promise.reject();
					}
					return {};
				})
			)
			.withMessage('Github link already in use.')
			.optional(),
	],

	forUpdate: [
		check('label')
			.isString()
			.withMessage('Enter a valid label.')
			.optional(),

		check('fields')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one field.')
			.optional(),

		check('certified')
			.isBoolean()
			.withMessage('Enter a valid certification state')
			.optional(),

		check('clients')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one client.')
			.optional(),

		check('jobs')
			.isArray({ min: 1 })
			.withMessage('You must enter at least one job.')
			.optional(),

		check('website')
			.isURL()
			.withMessage('Enter a valid website URL.')
			.optional(),

		check('githubLink')
			.isURL()
			.withMessage('Enter a valid Github URL.')
			.optional(),
	]
};

export default organisationRules;

