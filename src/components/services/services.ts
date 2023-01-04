import dotenv from 'dotenv';
import { IService } from '../../types/Service';
import Service from './model';

export default class ServiceS {
	constructor() {
		dotenv.config();
	}

	private static _service: IService;

	static get service(): IService {
		return ServiceS._service;
	}

	async create({ iconUrl, label, description }: IService): Promise<IService> {
		try {
			const service = await Service.create({ iconUrl, label, description });
			return this.getServiceById(service._id);
		} catch (error) {
			return null;
		}
	}

	async getAll(): Promise<IService[] | []> {
		try {
			const services = await Service.find({});
			return services;
		} catch (error) {
			return [];
		}
	}

	async searchByKeyword(keyword: string): Promise<IService[] | []> {
		try {
			const results = await Service.find({
				label: {
					$regex: `${keyword}`, $options: 'i'
				}
			});
			return results;
		} catch (error) {
			return [];
		}
	}

	async getServiceById(id: string): Promise<IService | null> {
		try {
			const service = await Service.findById(id);
			return service;
		} catch (error) {
			return null;
		}
	}

}
