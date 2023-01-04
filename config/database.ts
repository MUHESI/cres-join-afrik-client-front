/* eslint-disable no-console */
import config from 'config';
import { ConnectionOptions, connect } from 'mongoose';

export enum TEST_CASES {
	USER = 'User',
	JOB = 'Job',
	NOTIFICATION = 'Notification',
	ORGA = 'Orga',
	PAYMENT = 'Payment',
	PROFILE = 'Profile',
	RATE = 'Rate',
	SERVICE = 'Service',
	DEFAULT = 'Default',
}

const connectDB = async (): Promise<void> => {
	try {
		const mongoURI: string = config.get('mongoURI');

		const options: ConnectionOptions = {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		};
		await connect(mongoURI, options);
		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

export const connectDBTest = async (testCase?: TEST_CASES): Promise<void> => {
	try {
	  let mongoURI: string;
		if (testCase === TEST_CASES.DEFAULT) {
			mongoURI = config.get('mongoURI');
		} else {
			mongoURI = config.get(`mongoURITest${  testCase}`);
		}

		const options: ConnectionOptions = {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		};
		await connect(mongoURI, options);
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

export default connectDB;
