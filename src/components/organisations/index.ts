import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import HttpStatusCodes from 'http-status-codes';
import { matchedData, validationResult } from 'express-validator';
import OrganisationService from './services';
import { IOrganisation } from '../../types/Organisation';
import organisationRules from './rules';
import authMiddleware from '../../middleware/auth';


const organisationRouter: Router = Router();
const organisationService = new OrganisationService();
const objectId = mongoose.Types.ObjectId;

// Get organisations
organisationRouter.get('/', async (req: Request, res: Response) => {
	await organisationService.getOrganisations({
		limit: parseInt(req.query.limit.toString(), 10),
		page: parseInt(req.query.page.toString(), 10),
	}).then(n => {

		if (n)
			return res.status(HttpStatusCodes.OK).json(n);
		return res.status(HttpStatusCodes.OK).json(n);
	});
	return null;
});

// Create new organisation
organisationRouter.post('/', organisationRules.forCreation, async (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const payload = matchedData(req) as IOrganisation;

	await organisationService.createOrganisation(payload).then(n => {

		if (n)
			return res.status(HttpStatusCodes.CREATED).json({
				data: n,
				sucess: true
			});
		return res.status(HttpStatusCodes.CREATED).json({
			data: n,
			sucess: false
		});
	});
	return null;
});

// SEARCH FEATURE

organisationRouter.get('/search/:keyword', (req: Request, res: Response) => {
	const { keyword } = req.params;
	organisationService.searchOrganisation(keyword, {
		limit: parseInt(req.query.limit.toString(), 10),
		page: parseInt(req.query.page.toString(), 10),
	}).then(data => {
		res.status(data !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json(data);
	});
});

// Update an organisation
organisationRouter.put('/:idOrganisation', authMiddleware(), organisationRules.forUpdate, (req: Request, res: Response) => {
	const errors = validationResult(req);
	const { organisationId, idClient } = req.params;

	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	if (!objectId.isValid(organisationId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Organisation doesn\'t exist' });

	const payload = matchedData(req) as IOrganisation;

	organisationService.updateOrganisation(organisationId, idClient, payload).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));

	return null;
});

// Delete specific an organisation
organisationRouter.delete('/:idOrganisation', (req: Request, res: Response) => {
	const organisationId = req.params.idOrganisation;

	if (!objectId.isValid(organisationId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Organisation doesn\'t exist' });

	organisationService.deleteOrganisation(organisationId).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));

	return null;

});

export default organisationRouter;
