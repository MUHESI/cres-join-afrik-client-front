import HttpStatusCodes from 'http-status-codes';
/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Request, Response, Router } from 'express';
import { matchedData, validationResult } from 'express-validator';
import clientMiddleware from '../../middleware/client';
 import {  ICorrection } from '../../types/job';
import correctionRules from './rules';
import CorrectionService from './services';
import authMiddleware from '../../middleware/auth';

const correctionRouter: Router = Router();
const correctionServices = new CorrectionService();

/**
 * @description: This endpoint is to create a new correction request
 * @protected: ONLY CONNECTED CLIENTS CAN REQUEST FOR CORRECTION
 *
 */

correctionRouter.post(
	'/',
	correctionRules.forCreation,
	authMiddleware(),
	clientMiddleware,
	(req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

		 const payload = matchedData(req) as ICorrection;
		correctionServices.createCorrection(payload)
			.then(response => res.status(response.data ? HttpStatusCodes.CREATED : HttpStatusCodes.BAD_REQUEST)
				.json(response));
		return null;
	}
);
correctionRouter.get(
	'/:idJob',
	correctionRules.forCreation,
	authMiddleware(),
	(req: Request, res: Response) => {
	const { idJob,  } = req.params;
	const resR =  { res: 'null' };

		correctionServices.getCorrectionsJobs(idJob)
			.then(response => res.status(response ? HttpStatusCodes.ACCEPTED : HttpStatusCodes.BAD_REQUEST)
				.json(response));
		return null; 
	}
);
/**
 * @description: This endpoint is to update a correction entries
 * @protected: ONLY CONNECTED USER (CLIENT OR FREELANCER) CAN REQUEST FOR CORRECTION
 *
 */
correctionRouter.put(
	'/:idCorrection',
	authMiddleware(),
	(req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

		const payload = matchedData(req) as ICorrection;	

		const { idCorrection } = req.params;
		correctionServices.updateCorrection(req.body, idCorrection)
			.then(response => res.status(response.data ? HttpStatusCodes.CREATED : HttpStatusCodes.BAD_REQUEST)
				.json(response));
		return null;
	}
);

export default correctionRouter;
