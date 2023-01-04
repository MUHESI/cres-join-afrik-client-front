/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UpdateWriteOpResult } from 'mongoose';
import { IApplication } from '../../types/application';
import Application from './model';

export default class ApplicationService {
	async getApplication(idApplication: string) {
		try {
			const application = await Application.findById(idApplication);
			if (!application) {
				return {
					data: null,
					message: 'incorrect_application_id',
					success: false,
				};
			}
			return {
				data: application,
				message: 'success',
				success: true,
			};
		} catch (error) {
			return {
				data: null,
				message: 'server_error_found',
				success: false,
			};
		}
	}

	async updateApplication(idApplication: string, {
		hourlyRate,
		timeOfExecution,// IN HOURS
		notes,
		milestones,
		// dateOfApplication,
		status,
	}: IApplication): Promise<UpdateWriteOpResult> {
		try {
			const updateApplication = await Application.updateOne({
				_id: idApplication
			}, {
				$set: {
					hourlyRate,
					timeOfExecution,
					notes,
					milestones,
					// dateOfApplication,
					status,
				}
			}, {
				upsert: false
			});
			return updateApplication;
		} catch (error) {
			return null;
		}
	}

}
