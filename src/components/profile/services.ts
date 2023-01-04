import { UpdateWriteOpResult } from 'mongoose';
import { Params } from '../../types/Payload';
import { IProfile, Roles, IUser } from '../../types/user';
import Profile from './model';
import User from '../user/model';
import Job from '../jobs/model';
import Application from '../applications/model';
import { IApplication } from '../../types/application';

enum JobStatuses {
	ONGOING = 'ONGOING',
	CANCELED = 'CANCELED',
	DELETED = 'DELETED',
	INREVIEW = 'INREVIEW',
	COMPLETED = 'COMPLETED',
	CREATED = 'CREATED'
}

export default class ProfileService {

	async createProfile({
		// IMPORTANT
		user,
		schoolLevel,
		availableTime,	
		bio,
		phoneNumber,
		country,
		city,	
		yearsOfExperience,
		organisation,
		professionalExperience,
		educationPath,
		socialsMedia,
		languages,
		skills

	}: IProfile): Promise<IProfile | null> {
		try {
			// CHECK IF THE PROFILE EXISTS
			const profile = await Profile.findOne({
				user
			});
			if (!profile) {
				const profileCreated = await Profile.create({
					user,
					bio,
					phoneNumber,
					country,
					city,			
					yearsOfExperience,
					availableTime,
					organisation,
					schoolLevel,
					languages,
					skills,
					professionalExperience,
					educationPath,
					socialsMedia,

				});
				return profileCreated;
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	async getProfile(idUser: string): Promise<IProfile> {
		try {
			const profile = await Profile.findOne({
				user: idUser
			})
			 .populate('achievements')
				.populate('user', '-_v -password')
				.populate('jobApplied')
				.populate('jobSaved')
				.populate('jobsSaved')
				.populate('jobSelected')
				.populate('rating')
				.populate('applications')
				.populate('jobsCreated');
			return profile;
		} catch (error) {
			return null;
		}
	}

	async searchFreelancer(keyword: string, {
		limit,
		page,
	}: Params): Promise<{
		data: IProfile[];
		pages: number;
	}> {
		try {
			const filter = {
				$and: [
					{
						roles: {
							$in: [Roles.FREELANCER]
						}
					},
					{
						$or: [
							{
								fName: {
									$regex: `${keyword}`,
									$options: 'i'
								},
							},
							{
								lName: {
									$regex: `${keyword}`,
									$options: 'i'
								},
							},
							{
								email: {
									$regex: `${keyword}`,
									$options: 'i'
								},
							},
						]
					}
				]
			};
			const skip = (page - 1) * limit;
			const resultsUsers = await User.find(filter).skip(skip).limit(limit);
			const ids = resultsUsers.map((doc) => doc._id);
			const results = await Profile.find({
				user: {
					$in: ids
				}
			}).populate('user').skip(skip).limit(limit);
			const count = await User.countDocuments(filter);
			const pages = this.getNumberOfPages(count, limit);
			return {
				data: results,
				pages,
			};
		} catch (error) {
			return null;
		}
	}

	async searchClient(keyword: string, {
		limit,
		page,
	}: Params): Promise<{
		data: IUser[];
		pages: number;
	}> {
		const filter = {
			$and: [
				{
					roles: {
						$in: [Roles.CLIENT]
					}
				},
				{
					$or: [
						{
							fName: {
								$regex: `${keyword}`,
								$options: 'i'
							},
							lName: {
								$regex: `${keyword}`,
								$options: 'i'
							},
							email: {
								$regex: `${keyword}`,
								$options: 'i'
							},
						},
					]
				}
			]
		};
		try {
			const skip = (page - 1) * limit;
			const results = await User.find(filter).populate('profile').skip(skip).limit(limit);
			const count = await User.countDocuments(filter);
			const pages = this.getNumberOfPages(count, limit);
			return {
				data: results,
				pages,
			};
		} catch (error) {
			return null;
		}
	}

	async getRecentProfiles(): Promise<IProfile[]> {
		try {
			const recentProfiles = await Profile.find({}).populate('user').limit(12).sort({ _id: -1 }); // TO UPDATE THE CONSTANT
			return recentProfiles;
		} catch (ex) {
			return null;
		}
	}


	async updateProfile(idProfile: string, {
		phoneNumber,
		bio,
		country,
		achievements,
		experienceLevel,
		professionalExperience,
		educationPath,
		socialsMedia,
		skills,
	}: IProfile): Promise<UpdateWriteOpResult> {
		try {
			const updateProfile = await Profile.updateOne({
				user: idProfile
			}, {
				$set: {
					phoneNumber,
					country,
					bio,				
					achievements,
					experienceLevel,
					professionalExperience,
					educationPath,
					socialsMedia,
					skills,

				}
			}, {
				upsert: false
			});
			return updateProfile;
		} catch (error) {
			return null;
		}
	}

	async visitProfil(idVisitor: string, idUser: string): Promise<{
		data: UpdateWriteOpResult;
		message: string;
	}> {
		try {
			if (idVisitor === idUser) return { data: null, message: 'impossible_action' };
			const updatedProfile = await Profile.updateOne({
				user: idVisitor
			}, {
				$push: {
					profilesVisited: idUser
				}
			}, {
				upsert: false
			});
			return { data: updatedProfile, message: 'common_success_message' };
		} catch (error) {
			return null;
		}
	}

	/**
	 * @param param0
	 */
	async showAllProfiles(
		{
			limit,
			page,
		}: Params,
	): Promise<{
		profiles: IProfile[];
		count: number;
		pages: number;
	}> {
		try {
			const skip = (page - 1) * limit;
			const profiles = await Profile.find({}).populate('user').limit(limit).skip(skip);
			const count = await Profile.countDocuments({});
			const pages = this.getNumberOfPages(count, limit);
			return {
				profiles,
				count,
				pages
			};
		} catch (error) {
			return null;
		}
	}

	/**
	 *
	 * @param param0
	 */
	async showProfiles(
		{
			limit,
			page,
			role = Roles.FREELANCER,
		}: Params,
		idUser: string
	): Promise<{
		profiles: IProfile[];
		count: number;
		pages: number;
		profilesVisited?: IUser[]
	}> {
		try {
			const skip = (page - 1) * limit;
			const profiles = await Profile.find().populate({
				path: 'user',
				match: {
					roles: {
						$in: [role]
					}
				}
			}).limit(limit).skip(skip);
			// GET PROFILE VISITED
			const currentUser = await Profile.findOne({
				user: idUser
			});
			if (!currentUser) return {
				profiles: null,
				count: 0,
				pages: 0,
				profilesVisited: null
			};
			const count = await Profile.countDocuments({});
			const pages = this.getNumberOfPages(count, limit);
			return {
				profiles,
				count,
				pages,
				profilesVisited: currentUser.profilesVisited
			};
		} catch (error) {
			return null;
		}
	}

	private getNumberOfPages(count: number, limit: number): number {
		return (count % limit) === 0 ? (count / limit) : Math.floor(count / limit) + 1;
	}

	// Apply to a job
	async applyToJob({
		hourlyRate,
		timeOfExecution,
		notes = '',
		milestones,
	}: IApplication,
		job: string,
		user: string,
	): Promise<{
		data: IApplication;
		success: boolean;
		message: string;
	}> {

		try {
			// Get user
			const user_ = await User.findById(user);
			// Get job
			const job_ = await Job.findById(job);

			// Get profile
			const profile = await Profile.findOne({ user: user_._id });

			// Impossible to apply to a finished job
			if (job_.isFinished) {
				return {
					data: null,
					success: false,
					message: 'impossible_to_apply_job_finished'
				};
			}

			// Check if the job is already applied by the same freelancer
			// if (profile.jobApplied !== undefined && profile.jobApplied.includes(job._id)) {
			// 	return { error: 'This job is already applied by this freelancer.' };
			// }

			// CREATE NEW APPLICATION
			const application = await Application.create({
				hourlyRate,
				timeOfExecution,
				notes,
				milestones,
				job,
				user,
			});

			await Job.updateOne(
				{ _id: job },
				{
					$push: { applications: application._id }
				}
			);

			// Add job to applied jobs list
			await Profile.updateOne(
				{ _id: profile._id },
				{ $push: { applications: application._id } }
			);

			return {
				data: application,
				success: true,
				message: 'job_application_submitted'
			};

		} catch (error) {
			return {
				data: null,
				message: 'an_error_occured',
				success: false
			};
		}
	}

	// Select a freelancer to a job (hire a freelancer)
	async selectFreelancerToJob(idClient: string, idFreelancer: string, idJob: string): Promise<UpdateWriteOpResult | { error: string; }> {
		try {
			// Get client
			const client = await User.findById(idClient);

			// Get freelancer
			const freelancer = await User.findById(idFreelancer);

			// Get job
			const job = await Job.findById(idJob);

			// Get freelancer profile
			const freelancerProfile = await Profile.findOne({ user: freelancer._id });


			// Client cannot make action to a job that doesn't belong to him
			if (String(client._id) !== String(job.client)) {
				return { error: 'Job doesn\'t belong to the client' };
			}

			// Impossible to select a freelancer to a finished job
			if (job.isFinished) {
				return { error: 'The job is finished' };
			}

			// Prevent client to selected more freelancer than what he have set when he was creating the job
			// if (freelancerProfile.jobSelected !== undefined && freelancerProfile.jobSelected.length === job.numberOfDevs) {
			// 	return { error: 'The number of devs is reached' };
			// }

			// Check if the freelancer has already applied to the job
			if (!freelancerProfile.jobApplied.includes(job._id)) {
				return { error: 'The freelancer doesn\'t apply to this job' };
			}

			// Check if the freelancer is already selected
			if (freelancerProfile.jobSelected !== undefined && freelancerProfile.jobSelected.includes(job._id)) {
				return { error: 'The freelancer is already selected to this job' };
			}

			// UPDATE THE JOB STATUS
			await job.update({
				$set: {
					status: JobStatuses.ONGOING,
				}
			});

			// Add job to selected jobs list
			return await Profile.updateOne(
				{ _id: freelancerProfile._id },
				{ $push: { jobSelected: job._id } },
				{ upsert: true }
			);

		} catch (error) {
			return null;
		}
	}
}
