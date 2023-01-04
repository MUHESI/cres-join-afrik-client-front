import { Router, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import HttpStatusCodes from 'http-status-codes';
import mongoose from 'mongoose';
import profileRules from './rules';
import ProfileService from './services';
import { IProfile, Roles } from '../../types/user';
import clientMiddleware from '../../middleware/client';
import authMiddleware from '../../middleware/auth';
import ApplicationRules from '../applications/rules';
import { IApplication } from '../../types/application';

const profileRouter: Router = Router();
const profileService = new ProfileService();
const objectId = mongoose.Types.ObjectId;

/**
 * @actions POST
 */
profileRouter.post('/', profileRules.forCreation, (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			errors: errors.array(),
			success: false
		});
	}
	const payload = matchedData(req) as IProfile;
    const profileCreated = profileService.createProfile(payload);
	return profileCreated.then(p => {
	 	if (p) {
	 		res.status(HttpStatusCodes.CREATED).json({
	 			data: p,
	 			success: true
	 		});
	 	} else {
	 		res.status(HttpStatusCodes.BAD_REQUEST).json({
	 			data: null,
	 			success: false
	 		});
	 	}
	 });

});

/**
 * @actions GET
 */

profileRouter.get(
	'/',
	// authMiddleware(),
	// clientMiddleware,
	async (req: Request, res: Response) => {
		profileService.showAllProfiles({
			limit: parseInt(req.query.limit.toString(), 10),
			page: parseInt(req.query.page.toString(), 10),
		}).then(profiles => res.status(profiles ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
			data: profiles,
			success: !!profiles,
		}));
	}
);

profileRouter.get(
	'/search/:keyword',
	authMiddleware(),
	clientMiddleware,
	async (req: Request, res: Response) => {
		const { keyword } = req.params;
		profileService.searchFreelancer(keyword, {
			limit: parseInt(req.query.limit.toString(), 10),
			page: parseInt(req.query.page.toString(), 10),
		}).then(users => {
			res.status(users !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
				data: users,
				success: !!users,
			});
		});
	}
);

profileRouter.get(
	'/search_client/:keywords',	async (req: Request, res: Response) => {
		const { keywords } = req.params;
		profileService.searchFreelancer(keywords, {
			limit: parseInt(req.query.limit.toString(), 10),
			page: parseInt(req.query.page.toString(), 10),
		}).then(users => {
			res.status(users !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
				data: users,
				success: !!users,
			});
		});
	}
);

profileRouter.get(
	'/freelancers/recent',
	authMiddleware(),
	clientMiddleware,
	async (req: Request, res: Response) => {
		profileService.getRecentProfiles().then(profiles => res.status(profiles !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
			data: profiles,
			success: !!profiles,
		}));
	}
);

profileRouter.get('/freelancers/:idUser', authMiddleware(), clientMiddleware, async (req: Request, res: Response) => {
	const { idUser } = req.params;
	profileService.showProfiles({
		limit: parseInt(req.query.limit.toString(), 10),
		page: parseInt(req.query.page.toString(), 10),
	}, idUser).then(profiles => res.status(profiles.profiles !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: profiles,
		success: !!profiles.profiles,
	}));
});

profileRouter.get('/clients/:idUser', authMiddleware(), async (req: Request, res: Response) => {
	const { idUser } = req.params;
	profileService.showProfiles({
		limit: parseInt(req.query.limit.toString(), 10),
		page: parseInt(req.query.page.toString(), 10),
		role: Roles.CLIENT,
	}, idUser).then(profiles => res.status(profiles.profiles !== null ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: profiles,
		success: !!profiles.profiles,
	}));
});

profileRouter.get('/:idUser', async (req: Request, res: Response) => {
	const p = await profileService.getProfile(req.params.idUser);

	return res.status(HttpStatusCodes.OK).json({
		data: p,
		success: true
	});
});

/**
 * @action PUT
 */


profileRouter.put('/:idUser', profileRules.forUpdate, (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			errors: errors.array(),
			success: false
		});
	}

	const payload = matchedData(req) as IProfile;

	profileService.updateProfile(req.params.idUser, payload).then(p => res.status(p ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: p,
		success: !!p
	}));

	return null;
});

profileRouter.put('visit/:idVisitor/:idUser', authMiddleware(), (req: Request, res: Response) => {

	profileService.visitProfil(req.params.idVisitor, req.params.idUser).then(p => res.status(p.data ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
		data: p.data,
		message: p.message,
		success: !!p
	}));

	return null;
});

// Apply to a job
profileRouter.put('/apply/:idUser/:idJob', ApplicationRules.forApplication, authMiddleware(), async (req: Request, res: Response) => {
	const userId = req.params.idUser;
	const jobId = req.params.idJob;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			errors: errors.array(),
			success: false
		});
	}

	const payload = matchedData(req) as IApplication;

	if (!objectId.isValid(userId) || !objectId.isValid(jobId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Invalid user or job.' });

	const jobApplied = profileService.applyToJob(payload, jobId, userId);

	return jobApplied.then(p => {
		res.status(p.data ? HttpStatusCodes.CREATED : HttpStatusCodes.BAD_REQUEST).json(p);
	});
});
// Submit a task
// profileRouter.put('/submit/:applicationId', ApplicationRules.forApplication, authMiddleware(), async (req: Request, res: Response) => {
// 	const applicationId = req.params.applicationId;
// 	const errors = validationResult(req);

// 	if (!errors.isEmpty()) {
// 		return res.status(HttpStatusCodes.BAD_REQUEST).json({
// 			errors: errors.array(),
// 			success: false
// 		});
// 	}

// 	const payload = matchedData(req) as IMilestone;

// 	if (!objectId.isValid(applicationId))
// 		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Invalid user or job.' });

// 	const submitTask = profileService.applyToJob(payload, applicationId);

// 	return submitTask.then(p => {
// 		res.status(p.data ? HttpStatusCodes.CREATED : HttpStatusCodes.BAD_REQUEST).json(p);
// 	});
// });

// Select a freelancer to a job
profileRouter.put('/select/:idClient/:idFreelancer/:idJob', async (req: Request, res: Response) => {
	const clientId = req.params.idClient;
	const freelancerId = req.params.idFreelancer;
	const jobId = req.params.idJob;

	if (!objectId.isValid(clientId) || !objectId.isValid(freelancerId) || !objectId.isValid(jobId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Invalid client, freelancer or job.' });

	return profileService.selectFreelancerToJob(clientId, freelancerId, jobId).then(p => {
		if (p) {
			res.status(HttpStatusCodes.CREATED).json({
				data: p,
				success: true,
			});
		} else {
			res.status(HttpStatusCodes.BAD_REQUEST).json({
				data: null,
				success: false
			});
		}
	});

});

export default profileRouter;
