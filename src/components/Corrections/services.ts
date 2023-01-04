import { ICorrection } from '../../types/job';
import Correction from './model';

export default class correctionService {
	async createCorrection({
		milestone,
		job,
		deadlineDays,
		document,
		message,
	}: ICorrection): Promise<{
		data: ICorrection,
		success: boolean,
		message: string
	}> {
		try {
			const newCorrection = await Correction.create({
				milestone,
				job,
				deadlineDays,
				document,
				message,
			});
			return {
				data: newCorrection,
				success: true,
				message: 'correction_request_sent'
			};
		} catch (error) {
			return {
				data: null,
				success: false,
				message: 'correction_request_fails'
			};
		}
	}

		async getCorrectionsJobs(idJob : string) : Promise<ICorrection[]> {
		try {
		
			const correctionsJobs = await Correction.find({ job: idJob }).sort({ _id: -1 }); 
			return correctionsJobs;
		} catch (ex) {
			return null;
		}
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
			async updateCorrection(
		{ status, deadlineDays }: ICorrection, idCorrection: string){
		try {
			const correctionUpdated = await Correction.updateOne({
				_id: idCorrection,
			}, {
				$set: {
					status,
					 deadlineDays
				}
			});
			return {
				data: correctionUpdated,
				success: true,
				idCorrection,
				message: 'correction_request_updated'
			};
		} catch (error) {
			return {
				data: null,
				success: false,
				message: 'correction_request_updated_failure'
			};
		}
	}
}
