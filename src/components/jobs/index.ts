import HttpStatusCodes from 'http-status-codes';
/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Request, Response, Router } from 'express';
import { matchedData, validationResult } from 'express-validator';
import clientMiddleware from '../../middleware/client';
import { IUser, Roles } from '../../types/user';
 import { IInviteFreelancer, IJob   } from '../../types/job';

import jobRules from './rules';
import JobService from './services';
import authMiddleware from '../../middleware/auth';
import UserService from '../user/services';


const jobRouter: Router = Router();
const jobService = new JobService();

//
const userService = new UserService();


/**
 * @protected
 */


jobRouter.post('/', jobRules.forCreation, authMiddleware(), (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	 const payload = matchedData(req) as IJob;
	

	jobService.createJob(payload).then(j => {

		if (j) {

			return res.status(HttpStatusCodes.CREATED).json({
				j,
				success: true
			});
		}

		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			j,
			success: false
		});
	});

	return null;
});

jobRouter.put('/save_job/:idJob/:idFreelancer', authMiddleware(), (req: Request, res: Response) => {
	const { idJob, idFreelancer } = req.params;
	jobService.saveJob(idJob, idFreelancer)
		.then(response => {
			res.status(response?.data ? HttpStatusCodes.CREATED : HttpStatusCodes.BAD_REQUEST)
				.json({
					data: response?.data,
					success: !!response
				});
		});
});

/**
 * @public
 * @description GET THE RECENT 12 JOB ADDED
 *
 */

jobRouter.get('/recents', async (req: Request, res: Response) => {
	jobService.getRecentJobs().then(jobs => res.status(jobs !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: jobs,
		success: !!jobs,
	}));
});

/**
 * @protected
 */
jobRouter.put('/:idJob', jobRules.forUpdate, authMiddleware(), clientMiddleware, (req: Request, res: Response) => {

	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());
	const payload = matchedData(req) as IJob;

	jobService.updateJob(req.params.idJob, payload).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));

	return null;
});

jobRouter.put('/updateStatus/:idJob', jobRules.forUpdate, authMiddleware(), clientMiddleware, (req: Request, res: Response) => {

	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());
	// const payload = matchedData(req) as IJob;
	const payload = matchedData(req) as any;
		jobService.updateStatusJob(req.params.idJob, payload).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));

	return null;
});

jobRouter.get('/', (req: Request, res: Response) => {
	jobService.getPaginated({
		limit: req.query.limit ? parseInt(req.query.limit?.toString(), 10) : null,
		page: req.query.page ? parseInt(req.query.page?.toString(), 10) : null
	}).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));
});

jobRouter.get('/byStatus/:status', (req: Request, res: Response) => {
	jobService.getByStatusPaginated({
		limit: req.query.limit ? parseInt(req.query.limit?.toString(), 10) : null,
		page: req.query.page ? parseInt(req.query.page?.toString(), 10) : null
	}).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));
});

jobRouter.get('/search/:keyword', (req: Request, res: Response) => {
	const { keyword } = req.params;
	jobService.searchByKeyword(keyword, {
		limit: parseInt(req.query.limit.toString(), 10),
		page: parseInt(req.query.page.toString(), 10)
	}).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));
});

jobRouter.get('/job/:idJob', (req: Request, res: Response) => {
	const { idJob } = req.params;
	jobService.showJob(idJob).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));
});
/**
 * @getJobByIdClient
 */
jobRouter.get('/client/:idClient/jobs', (req: Request, res: Response) => {
	const { idClient } = req.params;
	jobService.showJobsClient(idClient).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));
});


jobRouter.get('/filter', (req: Request, res: Response) => {
	const skills = req.query.skills ? req.query.skills.toString().split(',') : [];
	const languages = req.query.languages ? req.query.languages.toString().split(',') : [];
	const isFinished = false; // TO BE UPDATED
	const experienceLevel = req.query.experienceLevel ? req.query.experienceLevel.toString() : '';
	const price = req.query.price ? parseInt(req.query.price.toString(), 10) : 0;
	jobService.getCategorized({
		limit: parseInt(req.query.limit.toString(), 10),
		page: parseInt(req.query.page.toString(), 10)
	}, {
		skills,
		languages,
		isFinished,
		experienceLevel,
		price
	}).then(j => res.status(HttpStatusCodes.OK).json({
		data: j,
		success: true,
	}));
});
/**
 * @protected
 */
jobRouter.delete('/:idJob', authMiddleware(), clientMiddleware, (req: Request, res: Response) => {

	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());
	jobService.deleteJob(req.params.idJob).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: j,
		success: !!j
	}));

	return null;
});

jobRouter.post('/inviteFreelancer',   (req: Request, res: Response) => {
    // const payload = matchedData(req) as IInviteFreelancer;
	 const { idFreelancer , idClient, idJob } = req.body;
	 const payload :IInviteFreelancer  =  { idFreelancer , idClient, idJob };	
	jobService.inviteFreelancer(payload).then(j => res.status(j ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
	data: j,
		success: true
	}));
	return null;
});          
export default jobRouter;