import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import HttpStatusCodes from 'http-status-codes';
import profileRouter from './components/profile';
import registerRoutes from './routes';
import Environment from './environments/environment';
import addErrorHandler from './middleware/error-handler';
import connectDB, { connectDBTest, TEST_CASES } from '../config/database';
import auth from './components/user';
import services from './components/services';
import jobRouter from './components/jobs';
import correctionRouter from './components/Corrections';
import notificationRouter from './components/notifications';
import organisationRouter from './components/organisations';
import ratingRouter from './components/rates';
import applicationRouter from './components/applications';


export default class App {
	public express: express.Application;

	public httpServer: http.Server;

	public env: Environment | string;

	constructor(env: Environment | string) {
		this.env = env;
	}

	public async init(test = TEST_CASES.DEFAULT): Promise<void> {
		this.express = express();
		this.httpServer = http.createServer(this.express);
		this.middleware();
		this.routes();
		this.addErrorHandler();
		if (test === TEST_CASES.DEFAULT) {
			connectDB();
		} else {
			connectDBTest(test);
		}
	}

	/**
	 * here register your all routes
	 */
	private routes(): void {
		this.express.get('/', this.basePathRoute);
		this.express.get('/api/getChatTokens', this.getChatApiKeys);
		this.express.get('/api/getChatRoom/:firstUser/:secondUser', this.getChatroomsId);
		registerRoutes(this.express);
		this.express.use('/api/auth', auth);
		this.express.use('/api/services', services);
		this.express.use('/api/jobs', jobRouter);
		this.express.use('/api/profile', profileRouter);
		this.express.use('/api/notifications', notificationRouter);
		this.express.use('/api/organisations', organisationRouter);
		this.express.use('/api/review', ratingRouter);
		this.express.use('/api/corrections', correctionRouter);
		this.express.use('/api/applications', applicationRouter);
		this.express.use('/api/application', applicationRouter);
		// UPDATED ENDPOINTS WITH THE CURRENT VERSION
		this.express.get('/api/v1/getChatTokens', this.getChatApiKeys);
		this.express.get('/api/v1/getChatRoom/:firstUser/:secondUser', this.getChatroomsId);
		this.express.use('/api/v1/auth', auth);
		this.express.use('/api/v1/services', services);
		this.express.use('/api/v1/jobs', jobRouter);
		this.express.use('/api/v1/profile', profileRouter);
		this.express.use('/api/v1/notifications', notificationRouter);
		this.express.use('/api/v1/organisations', organisationRouter);
		this.express.use('/api/v1/review', ratingRouter);
		this.express.use('/api/v1/corrections', correctionRouter);
		this.express.use('/api/v1/applications', applicationRouter);
		this.express.use('/api/v1/application', applicationRouter);
	}

	/**
	 * here you can apply your middlewares
	 */
	private middleware(): void {
		// support application/json type post data
		// support application/x-www-form-urlencoded post data
		// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
		this.express.use(helmet());
		this.express.use(express.json({ limit: '100mb' }));
		this.express.use(express.urlencoded({ limit: '100mb', extended: true }));
		this.express.use(cors());
	}

	private basePathRoute(_request: express.Request, response: express.Response): void {
		response.status(HttpStatusCodes.OK).json({ message: 'Server running!' });
	}

	private getChatApiKeys (_request: express.Request, res: express.Response ):void {
		res.status(HttpStatusCodes.OK).json({
			authToken: 'f3a444d101bf5cd0cae4231950844d8e4d6aecd2',
			apID: '1989572ec118ac27',
			region: 'US'
		});
	}

	private getChatroomsId (req: express.Request, res: express.Response): void {
		const { firstUser, secondUser } = req.params;
	  res.status(200).json({
			chatRoom: `${firstUser}${Math.round(Math.random() * 100)}${secondUser}`,
			success: true,
		});
	}

	private addErrorHandler(): void {
		this.express.use(addErrorHandler);
	}
}
