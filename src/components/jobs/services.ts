/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { UpdateWriteOpResult } from 'mongoose';
import { IJob, ICategoryJob,  JobStatuses, IInviteFreelancer  } from '../../types/job';
import { Destinations, INotification, StatusValues } from '../../types/notification';
import { Params, Query } from '../../types/Payload';
import UserService from '../user/services';
import Job from './model';
import NotificationService from '../notifications/services';
import Profile from '../profile/model';
import User from '../user/model';
import { sendInviteFreelancerEmail } from '../../../config/nodemailer.config';


export default class jobService {
	private _categories: ICategoryJob = {
		web: [
			'fullstack',
			'frontend',
			'backend',
		],
		mobile: [
			'ios',
			'android',
			'windows',
			'cross_plateform'
		],
		design: [
			'figma',
			'zepelin',
			'adobe',
			'figma'
		],
		devops: [
			'git',
			'aws',
			'heroku',
			'dgo',
			'doceker',
			'kuberbete'
		],
		desktop: [
			'macos',
			'windows',
			'linux',
			'other'
		]
	}

	/**
	 * @description Creates a new job in the database
	 * @param job
	 * @return Promise<IJob | null>
	 */
	async createJob(job: IJob): Promise<IJob | null> {
		try {
			const jobCreated = await Job.create({
				title: job.title,
				description: job.description,
				price: job.price,
				duration: job.duration,
				experienceLevel: job.experienceLevel,
				languages: job.languages,
				skills: job.skills,
				country: job.country,
				dueAt: job.dueAt,
				numberOfDevs: job.numberOfDevs,
				client: job.client,
				budget: job.budget,
				coverImage: job.coverImage,
				tasks: job.tasks,
				requirements: job.requirements,
				availableTime: job.availableTime,
				yearsOfExperience: job.yearsOfExperience,
				paymentMode: job.paymentMode,
				documents: job.documents,
				typeProject: job.typeProject,
				isFinished: false // BY DEFAULT WHEN A JOB GETS CREATED
			});

			// Create a notification when the client creates the job
			const notificationService = new NotificationService();
			const { user } = UserService;

			const notificationObj: INotification = {
				title: 'A new job has been created',
				content: `The job with title "${job.title}" has been created by ${user.email}`,
				source: user._id as string,
				destination: Destinations.ALL,
				status: StatusValues.UNSEEN
			};
			await notificationService.createNotification(notificationObj);

			// UPDATE THE CLIENT PROFILE
			await Profile.updateOne({
				user: job.client,
			}, {
				$push: {
					jobsCreated: jobCreated._id
				}
			});

			return jobCreated;
		} catch (error) {
			return null;
		}
	}

	/**
	 *
	 * @param keyword
	 * @param param1
	 */
	async searchByKeyword(
		keyword: string, {
			limit,
			page,
		}: Params
	): Promise<{ data: IJob[], pages: number }> {
		try {
			const filter = {
				$or: [
					{
						title: {
							$regex: `${keyword}`,
							$options: 'i'
						},
						description: {
							$regex: `${keyword}`,
							$options: 'i'
						},
					}
				]
			};
			const skip = (page - 1) * limit;
			const result = await Job.find(filter)
				.populate('client')
				.skip(skip)
				.limit(limit);
			const count = await Job.countDocuments(filter);
			const pages = this.getNumberOfPages(count, limit);
			return {
				data: result,
				pages
			};
		} catch (error) {
			return null;
		}
	}

	async getRecentJobs(): Promise<IJob[]> {
		try {
			const recentJobs = await Job.find({ status: JobStatuses.CREATED }).populate('client').limit(12).sort({ _id: -1 }); // TO UPDATE THE CONSTANT
			return recentJobs;
		} catch (ex) {
			return null;
		}
	}

	/**
	 * @description Gets the list of jobs paginated
	 * @param param0
	 * @return Promise<IJobs[] | []>
	 */
	async getPaginated({ limit = 0, page = 0 }: Params): Promise<{
		jobs: IJob[] | any;
		count?: number;
		pages?: number;
	}> {
		try {
			if (!limit && !page) {
				const jobs_ = await Job.find({
					isFinished: false,
					status: JobStatuses.CREATED
				}).sort({ _id: -1 });
				return {
					jobs: {
						mobile: jobs_.filter(job => this._categories.mobile.filter(e => job.skills?.includes(e)).length > 0),
						web: jobs_.filter(job => this._categories.web.filter(e => job.skills?.includes(e)).length > 0),
						desktop: jobs_.filter(job => this._categories.desktop.filter(e => job.skills?.includes(e)).length > 0),
						design: jobs_.filter(job => this._categories.design.filter(e => job.skills?.includes(e)).length > 0),
						devops: jobs_.filter(job => this._categories.devops.filter(e => job.skills?.includes(e)).length > 0),
						other: jobs_.filter(job => this._categories.mobile.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.web.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.design.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.desktop.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.devops.filter(e => job.skills?.includes(e)).length === 0),
					},
				};
			}
			const skip = (page - 1) * limit;
			const jobs = await Job.find({
				isFinished: false
			}).limit(limit).skip(skip).populate('client').populate('applications').sort({ _id: -1 });
			const count = await Job.countDocuments({});
			const pages = this.getNumberOfPages(count, limit);
			return {
				jobs,
				count,
				pages
			};

		} catch (error) {
			return null;
		}
	}

		/**
	 * @description Gets the list of jobs paginated according  status specified 
	 * @param param0
	 * @return Promise<IJobs[] | []>
	 */
	async getByStatusPaginated({ limit = 0, page = 0 }: Params): Promise<{
		jobs: IJob[] | any;
		count?: number;
		pages?: number;
	}> {
		try {
			if (!limit && !page) {
				const jobs_ = await Job.find({
				// status :  JobStatuses.NOSTARTED,
				isFinished: false
				}).sort({ _id: -1 });
				return {
					jobs: {
						mobile: jobs_.filter(job => this._categories.mobile.filter(e => job.skills?.includes(e)).length > 0),
						web: jobs_.filter(job => this._categories.web.filter(e => job.skills?.includes(e)).length > 0),
						desktop: jobs_.filter(job => this._categories.desktop.filter(e => job.skills?.includes(e)).length > 0),
						design: jobs_.filter(job => this._categories.design.filter(e => job.skills?.includes(e)).length > 0),
						devops: jobs_.filter(job => this._categories.devops.filter(e => job.skills?.includes(e)).length > 0),
						other: jobs_.filter(job => this._categories.mobile.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.web.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.design.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.desktop.filter(e => job.skills?.includes(e)).length === 0
							&&
							this._categories.devops.filter(e => job.skills?.includes(e)).length === 0),
					},
				};
			}
			const skip = (page - 1) * limit;
			const jobs = await Job.find({
		isFinished: false

			}).limit(limit).skip(skip).populate('client').populate('applications').sort({ _id: -1 });
			const count = await Job.countDocuments({});
			const pages = this.getNumberOfPages(count, limit);
			return {
				jobs,
				count,
				pages
			};

		} catch (error) {
			return null;
		}
	}

	/**
	 * @description Update an existing job in the collection
	 * @param idJob
	 * @param param1
	 */
	async updateJob(idJob: string, {
		title,
		description,
		price,
		duration,
		experienceLevel,
		languages,
		skills,
		country,
		status,
		numberOfDevs,
		budget,
		coverImage
	}: IJob): Promise<UpdateWriteOpResult> {
		try {
			const updatedJob = await Job.updateOne({
				_id: idJob
			}, {
				$set: {
					title,
					description,
					price,
					duration,
					experienceLevel,
					languages,
					skills,
					country,
					numberOfDevs,
					budget,
					coverImage,
					status,
					// dueAt
				}
			}, {
				upsert: false,
			});

			// Create a notification when the client updates the job
			const notificationService = new NotificationService();
			const { user } = UserService;

			const notificationObj: INotification = {
				title: 'A job has been updated',
				content: `The job with title "${title}" has been updated by ${user.email}`,
				source: user._id as string,
				destination: Destinations.ALL,
				status: StatusValues.UNSEEN
			};
			await notificationService.createNotification(notificationObj);

			return updatedJob;
		} catch (error) {
			return null;
		}
	}

	
	async updateStatusJob (idJob: string, {	status	}: IJob): Promise<UpdateWriteOpResult> {
		try {
			const updatedJob = await Job.updateOne({
				_id: idJob
			}, {
				$set: {				
					status,
				}
			}, {
				upsert: false,
			});
			const notificationService = new NotificationService();
			const { user } = UserService;

			const notificationObj: INotification = {
				title: 'A job has been updated',
				content: `The job with title "${idJob}" has been updated by ${user.email}`,
				source: user._id as string,
				destination: Destinations.ALL,
				status: StatusValues.UNSEEN
			};
			await notificationService.createNotification(notificationObj);

			return updatedJob;
		} catch (error) {
			return null;
		}
	}

	async deleteJob(idJob: string): Promise<any> {
		try {
			const deletedJob = await Job.deleteOne({ _id: idJob });

			return deletedJob;
		} catch (error) {
			return null;
		}
	}

	async saveJob(idJob: string, idFreelancer: string): Promise<{
		data: UpdateWriteOpResult;
	}> {
		try {
			const updatedUser = await Profile.updateOne({
				user: idFreelancer,
			}, {
				$push: {
					jobsSaved: idJob,
				}
			}, {
				upsert: false
			});
			return {
				data: updatedUser
			};
		} catch (error) {
			return null;
		}
	}

	/**
	 * @description Accepts a number of criterias and return matched data
	 * @param param0
	 * @param param1
	 */
	async getCategorized(
		{
			limit,
			page
		}: Params,
		{
			skills = [],
			isFinished = false,
			languages = [],
			experienceLevel,
			price = 0
		}: Query
	)
		: Promise<{
			jobs: IJob[];
			count: number;
			pages: number;
		}> {
		try {
			const skip = (page - 1) * limit;
			const jobs = await Job.find({
				isFinished,
				skills: { $all: skills },
				languages: { $all: languages },
				price: { $gte: price },
				experienceLevel,
			}).limit(limit).skip(skip).populate('client');
			const count = await Job.countDocuments({
				isFinished,
				skills: { $all: skills },
				languages: { $all: languages },
				price: { $gte: price },
				experienceLevel,
			});
			const pages = this.getNumberOfPages(count, limit);
			return {
				jobs,
				count,
				pages
			};
		} catch (error) {
			return null;
		}
	}

	async showJob(idJob: string): Promise<IJob> {
		try {
			const job = await Job.findOne({
				_id: idJob
			})
				.populate('client')
				.populate({
					path: 'applications',
					populate: {
						path: 'user',
					}
				});
			if (job) return job;
			return null;
		} catch (ex) {
			return null;
		}
	}

	async showJobsClient(idClient: string): Promise<IJob[]> {
		try {
			const job = await Job.find({
				client: idClient
			})				
				.populate({
					path: 'applications',
					populate: {
						path: 'user',
					}
				});

			if (job) return job;
			return null;
		} catch (ex) {
			return null;
		}
	}

	/**
	 *
	 * @param param0
	 */
	async getAll({ limit, page }: Params): Promise<{
		jobs: IJob[];
		count: number;
		pages: number;
	}> {
		try {
			const skip = (page - 1) * limit;
			const jobs = await Job.find({}).skip(skip).limit(limit).populate('client');
			const count = await Job.countDocuments({});
			const pages = this.getNumberOfPages(count, limit);
			return {
				jobs,
				count,
				pages
			};
		} catch (error) {
			return null;
		}
	}

	/**
	 *
	 * @param count
	 * @param limit
	 */
	private getNumberOfPages(count: number, limit: number): number {
		return (count % limit) === 0 ? (count / limit) : Math.floor(count / limit) + 1;
	}
	
	async inviteFreelancer(payload :IInviteFreelancer): Promise<any> {
		const URL_WEBSITE = 'join-africa-front.herokuapp.com';
		try {
			const { idFreelancer , idClient, idJob } = payload;
			const job = await Job.findOne({	_id: idJob });
			const freelancer = await User.findOne({	_id: idFreelancer });
			const client = await User.findOne({	_id: idClient });
			 if(!job|| !freelancer || !client ) return null;	
			const dataMail = {				
				namesClient:`${client.fName} ${client.lName}`,
				namesFreelancer:`${freelancer.fName} ${freelancer.lName}`,
				titleJob: job.title,
				dateCreationJob:new Date(job.createdAt).toLocaleDateString(),
				linkProfileClient: `${URL_WEBSITE}/profil-client/${idClient}`,
				linkAllJobs:`${URL_WEBSITE}/home-freelancer/`,	
				descriptionLinkJob:  `${URL_WEBSITE}/detail-job/${idJob}`
			 };
			 return sendInviteFreelancerEmail('JoinAfrik', freelancer.email , dataMail ) ;
		} catch (error) {
			return null;
		}
	}
	
}