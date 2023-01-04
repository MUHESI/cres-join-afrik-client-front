import { IOrganisation } from '../../types/Organisation';
import Organisation from './model';
import { Params } from '../../types/Payload';


export default class organisationService {

	// Get all organisations
	async getOrganisations({
		limit,
		page
	}: Params): Promise<{
		data: IOrganisation[]
		count: number;
		pages: number;
		success?: boolean
	}> {
		try {
			const skip = (page - 1) * limit;
			const count = await Organisation.countDocuments({});
			const pages = this.getNumberOfPages(count, limit);
			const organisations = await Organisation.find({})
				.populate('clients')
				.populate('jobs')
				.skip(skip)
				.limit(limit);
			return {
				data: organisations,
				count,
				pages,
				success: true
			};
		} catch (error) {
			return {
				data: null,
				count: 0,
				pages: 0,
				success: false
			};
		}
	}

	// Creation an organisation
	async createOrganisation({ label, fields, githubLink, website, certified, clients, jobs }: IOrganisation): Promise<IOrganisation | null> {
		try {
			const organisationCreated = await Organisation.create({
				label,
				fields,
				githubLink,
				website,
				certified,
				clients,
				jobs
			});

			return organisationCreated;

		} catch (error) {
			return null;
		}
	}

	// Update a specific organisation
	async updateOrganisation(
		idOrganisation: string,
		idClient: string,
		{
			label,
			fields,
			githubLink,
			website,
			certified,
			clients,
			jobs
		}: IOrganisation): Promise<IOrganisation> {

		try {
			const orgaToUpdate = await Organisation.find({
				_id: idOrganisation,
				clients: {
					$in: [idClient]
				}
			});

			if (orgaToUpdate) {
				await Organisation.updateOne(
					{
						_id: idOrganisation
					},
					{
						$set: {
							label,
							fields,
							githubLink,
							website,
							certified,
							clients,
							jobs
						}
					},
					{ upsert: false }
				);

				return Organisation.findById(idOrganisation);
			}

			return null;

		} catch (error) {
			return null;
		}
	}

	// SEARCH AN ORGANISATION BY KEYWORD

	async searchOrganisation(keyword: string, {
		limit,
		page,
	}: Params): Promise<{
		data: IOrganisation[],
		success: boolean,
		pages: number
	}> {
		try {
			const filter = {
				$or: [
					{
						label: {
							$regex: `${keyword}`,
							$options: 'i'
						},
					},
					{
						githubLink: {
							$regex: `${keyword}`,
							$options: 'i'
						},
					},
					{
						website: {
							$regex: `${keyword}`,
							$options: 'i'
						},
					}
				]
			};
			const skip = (page - 1) * limit;
			const organisations = await Organisation.find(filter);
			const count = await Organisation.countDocuments(filter);
			const pages = this.getNumberOfPages(count, limit);
			return {
				success: true,
				data: organisations,
				pages,
			};
		} catch (error) {
			return null;
		}
	}

	// Detele a specific organisation
	async deleteOrganisation(idOrganisation: string): Promise<IOrganisation | null> {
		try {
			return await Organisation.findByIdAndDelete(idOrganisation);

		} catch (error) {
			return null;
		}
	}

	private getNumberOfPages(count: number, limit: number): number {
		return (count % limit) === 0 ? (count / limit) : Math.floor(count / limit) + 1;
	}
}
