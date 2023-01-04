/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Request, Response, Router } from 'express';
import { matchedData, validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import mongoose from 'mongoose';
import { INotification } from '../../types/notification';
import { notificationRules, notificationRulesStatus, notificationRulesUpdate } from './rules';
import NotificationService from './services';



const notificationRouter: Router = Router();
const notificationService = new NotificationService();
const objectId = mongoose.Types.ObjectId;

// Get notifications
notificationRouter.get('/', async (req: Request, res: Response) => {

	await notificationService.getNotifications().then(n => {

		if (n)
			return res.status(HttpStatusCodes.OK).json({
				n,
				sucess: true
			});
		return res.status(HttpStatusCodes.OK).json({
			n,
			sucess: false
		});
	});
	return null;
});

// Create new notification
notificationRouter.post('/', notificationRules, async (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const payload = matchedData(req) as INotification;

	await notificationService.createNotification(payload).then(n => {

		if (n)
			return res.status(HttpStatusCodes.CREATED).json({
				n,
				sucess: true
			});
		return res.status(HttpStatusCodes.CREATED).json({
			n,
			sucess: false
		});
	});
	return null;
});

// Update only the status of a specific notification
notificationRouter.put('/status/:id/', notificationRulesStatus, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	const notificationId = req.params.id;

	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	if (!objectId.isValid(notificationId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Notification doesn\'t exist' });

	await notificationService.updateNotificationStatus(notificationId, req.body.status).then(n => {

		if (n)
			return res.status(HttpStatusCodes.OK).json({
				n,
				sucess: true
			});
		return res.status(HttpStatusCodes.OK).json({
			n,
			sucess: false
		});
	});
	return null;
});

// Update a specific notification
notificationRouter.put('/:id', notificationRules, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	const notificationId = req.params.id;

	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	if (!objectId.isValid(notificationId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Notification doesn\'t exist' });

	const payload = matchedData(req) as INotification;

	await notificationService.updateNotification(notificationId, payload).then(n => {

		if (n)
			return res.status(HttpStatusCodes.OK).json({
				n,
				sucess: true
			});
		return res.status(HttpStatusCodes.OK).json({
			n,
			sucess: false
		});
	});
	return null;
});


// Delete a specific notification
notificationRouter.delete('/:id', async (req: Request, res: Response) => {
	const notificationId = req.params.id;


	if (!objectId.isValid(notificationId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Notification doesn\'t exist' });

	await notificationService.deleteNotification(notificationId).then(n => {

		if (n)
			return res.status(HttpStatusCodes.OK).json({
				n,
				sucess: true
			});
		return res.status(HttpStatusCodes.OK).json({
			n,
			sucess: false
		});
	});
	return null;
});

export default notificationRouter;
