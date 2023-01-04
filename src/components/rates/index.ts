import { Router, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import mongoose from 'mongoose';
import ratingRules from './rules';
import RatingService from './services';
import { IRating } from '../../types/rating';
import clientMiddleware from '../../middleware/client';
import authMiddleware from '../../middleware/auth';

const ratingRouter: Router = Router();
const ratingService = new RatingService();
const objectId = mongoose.Types.ObjectId;

// Get rating by id
ratingRouter.get('/:idRating', ratingRules.forCreation, (req: Request, res: Response) => {
	const ratingId = req.params.idRating;

	if (!objectId.isValid(ratingId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Rating doesn\'t exist' });

	ratingService.getRatingById(ratingId).then(r => {

		if (r) {

			return res.status(HttpStatusCodes.CREATED).json({
				r,
				sucess: true
			});
		}

		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			r,
			sucess: false
		});
	});

	return null;
});

// GET REVIEWS OF A USER >> FREELANCER
ratingRouter.get('/reviews/:idUser', authMiddleware(), (req: Request, res: Response) => {
	const { idUser } = req.params;
	ratingService.getAllReviews(idUser, {
		limit: parseInt(req.query.limit.toString(), 10) || 10,
		page: parseInt(req.query.page.toString(), 10) || 1
	}).then(reviews => {
		res.status(reviews ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
			data: reviews,
			success: !!reviews
		});
	});
});
// GET REVIEWS OF A USER >> CLIENT
ratingRouter.get('/reviewsClient/:idUser', authMiddleware(), (req: Request, res: Response) => {
	const { idUser } = req.params;
	ratingService.getAllReviewsClient(idUser, {
		limit: parseInt(req.query.limit.toString(), 10) || 10,
		page: parseInt(req.query.page.toString(), 10) || 1
	}).then(reviews => {
		res.status(reviews ? HttpStatusCodes.OK : HttpStatusCodes.BAD_REQUEST).json({
			data: reviews,
			success: !!reviews
		});
	});
});

// Get rates average
ratingRouter.get('/average/:idFreelancer', ratingRules.forCreation, (req: Request, res: Response) => {
	const freelancerId = req.params.idFreelancer;

	if (!objectId.isValid(freelancerId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Freelancer doesn\'t exist' });

	ratingService.getRatesAverage(freelancerId).then(r => {

		if (r) {

			return res.status(HttpStatusCodes.CREATED).json({
				r,
				sucess: true
			});
		}

		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			r,
			sucess: false
		});
	});

	return null;
});

// Create rating
ratingRouter.post('/:idJob/:idClient/:idFreelancer', ratingRules.forCreation, (req: Request, res: Response) => {
	const errors = validationResult(req);
	const {
		idJob,
		idClient,
		idFreelancer
	} = req.params;
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const payload = matchedData(req) as IRating;
	 ratingService.createRating(
		idClient,
		idFreelancer,
		idJob,
		payload
	).then(r => {
		if (r.rating) {
			return res.status(HttpStatusCodes.CREATED).json({
				data: r,
				success: true,
				message: r.message,
			});
		}

		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			data: r.rating,
			message: r.message,
			success: false
		});
	});
 
	return null;
});

// Update the rate of a rating
ratingRouter.put('/:idRating', ratingRules.forUpdate, (req: Request, res: Response) => {
	const errors = validationResult(req);
	const ratingId = req.params.idRating;


	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	if (!objectId.isValid(ratingId))
		return res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: 'Rating doesn\'t exist' });

	const payload = matchedData(req) as IRating;

	ratingService.updateRatingRate(ratingId, payload.rate).then(r => {

		if (r) {

			return res.status(HttpStatusCodes.CREATED).json({
				r,
				sucess: true
			});
		}

		return res.status(HttpStatusCodes.BAD_REQUEST).json({
			r,
			sucess: false
		});
	});

	return null;
});

export default ratingRouter;
