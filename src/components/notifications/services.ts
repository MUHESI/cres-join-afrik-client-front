import { INotification, StatusValues } from '../../types/notification';
import Notification from './model';


export default class notificationService {

	async getNotifications(): Promise<INotification[]> {

		try {
			const allNotifications = Notification.find({}).populate('source');

			return allNotifications;

		} catch (error) {
			return null;
		}

	}

	async createNotification(notification: INotification): Promise<INotification | null> {

		try {
			const notificationCreated = await Notification.create({ title: notification.title, content: notification.content, source: notification.source, destination: notification.destination, status: notification.status });

			return notificationCreated;

		} catch (error) {
			return null;
		}

	}

	async updateNotification(id: string | number, notification: INotification): Promise<INotification> {

		try {

			const { title, content, source, destination, status } = notification;

			await Notification.findOneAndUpdate({ _id: id },
				{
					title,
					content,
					source,
					destination,
					status
				}
			);

			const notificationUpdated = Notification.findById(id);

			return notificationUpdated;

		} catch (error) {
			return null;
		}

	}

	async updateNotificationStatus(id: string | number, status: StatusValues): Promise<INotification> {

		try {

			await Notification.findOneAndUpdate({ _id: id },
				{
					'$set': {
						status
					}
				}
			);

			const notificationUpdated = Notification.findById(id);

			return notificationUpdated;

		} catch (error) {
			return null;
		}

	}

	async deleteNotification(id: string | number): Promise<INotification> {

		try {
			const notificationUpdated = await Notification.findOneAndDelete({ _id: id });

			return notificationUpdated;

		} catch (error) {
			return null;
		}

	}
}
