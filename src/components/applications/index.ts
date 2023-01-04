import { Router, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import HttpStatusCodes from 'http-status-codes';
import mongoose from 'mongoose';
import authMiddleware from '../../middleware/auth';
import ApplicationRules from './rules';
import ApplicationService from './services';
import { IApplication } from '../../types/application';
import clientMiddleware from '../../middleware/client';

const applicationRouter: Router = Router();
const applicationService = new ApplicationService();
const objectId = mongoose.Types.ObjectId;

/**
 * @action PUT
 */
// update  a task

applicationRouter.put('/update/:applicationId', ApplicationRules.forUpdate, authMiddleware(), async (req: Request, res: Response) => {
	const { applicationId } = req.params;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			errors: errors.array(),
			success: false
		});
	}

	const payload = matchedData(req) as IApplication;

	if (!objectId.isValid(applicationId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Invalid user or job.' });

	const updateTask = applicationService.updateApplication(req.params.applicationId, payload);

	return updateTask.then(p => {
		res.status(p ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
			success: !!p,
			message: 'application_updated_message'
		});
	});
});

applicationRouter.get('/application/:applicationId', authMiddleware(), clientMiddleware, async (req: Request, res: Response) => {
	const { applicationId } = req.params;
	const application = await applicationService.getApplication(applicationId);
	return res.status(application.data ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json(application);
});


export default applicationRouter;
