import { IRating, PostedByCategory } from '../../types/rating';
import Rating from './model';
import { Params } from '../../types/Payload';
import User from '../user/model';
import { Roles } from '../../types/user';
import Job from '../jobs/model';
import Profile from '../profile/model';

export default class ratingService {

	// Get a specific rating via his ID.
	async getRatingById(idRating: string): Promise<IRating> {
		try {
			return await Rating.findById(idRating)
				.populate('client')
				.populate('freelancer')
				.populate('job');
		} catch (error) {
			return null;
		}
	}

	// Create new rating
	async createRating(client: string, freelancer: string, job: string, { rate, feedback,termination,recommendation, postedBy }: IRating): Promise<{
		rating: IRating;
		message: string;
	}> {
		try {
			const client_ = await User.findOne({
				roles: {
					$in: [Roles.CLIENT]
				},
				_id: client,
			});
			const freelancer_ = await User.findOne({
				roles: {
					$in: [Roles.FREELANCER]
				},
				_id: freelancer
			});
			const job_ = await Job.findOne({
				_id: job,
				client,
			});

			if (!client_) return {
				rating: null,
				message: 'invalid_client'
			};

			if (!freelancer_) return {
				rating: null,
				message: 'invalid_freelancer'
			};

			if (!job_) return {
				rating: null,
				message: 'job_client_missmatch'
			};

			const rating = await Rating.create({
				client,
				freelancer,
				rate,
				job,
				feedback,
				termination,
				recommendation,
				date: new Date(),
				postedBy
			});
			// UPDATE THE USER'S RATES FIELDS
	 		await Profile.updateOne({
				user: postedBy === PostedByCategory.CLIENT ? client : freelancer,
			}, {
				$push: {
					rating: rating._id
				}
			});  
			return {
				rating,
				message: 'review_success_message'
			};
		} catch (error) {
			return null;
		}
	}

	// GET THE REVIEWS BY FREELANCER
	async getAllReviews(idUser: string, {
		limit,
		page,
	}: Params): Promise<IRating[]> {
		try {
			const skip = (page - 1) * limit;
			const reviews = await Rating.find({
				freelancer: idUser
			})
				.populate(['job', 'client'])
				.skip(skip)
				.limit(limit);
			return reviews;
		} catch (error) {
			return null;
		}
	}

		// GET THE REVIEWS BY CLIENT
	async getAllReviewsClient(idUser: string, {
		limit,
		page,
	}: Params): Promise<IRating[]> {
		try {
			const skip = (page - 1) * limit;
			const reviews = await Rating.find({
				client: idUser
			})
				 .populate(['freelancer', 'job'])
				.skip(skip)
				.limit(limit);
			return reviews;
		} catch (error) {
			return null;
		}
	}

	// Update the rate of a specific ratiing
	async updateRatingRate(idRating: string, rate: number): Promise<IRating> {
		try {
			await Rating.updateOne({ _id: idRating }, { $set: { rate } });

			return await Rating.findById(idRating);

		} catch (error) {
			return null;
		}
	}

	// Get rates average for a specific freelancer
	async getRatesAverage(idFreelancer: string): Promise<number | null> {
		try {
			const rates = await Rating.find({ freelancer: idFreelancer }).select('rate -_id');

			// Get the average of rates
			const getAverage = (rates_: IRating[]) => {
				let total = 0;
				for (let i = 0, _len = rates_.length; i < _len; i += 1) {
					total += rates_[i].rate;
				}
				return total / rates_.length;
			};

			return Number(getAverage(rates).toFixed(1));

		} catch (error) {
			return null;
		}
	}

	// GET THE LIST OF USERS ORDERED BY AVERAGE RATES

}
