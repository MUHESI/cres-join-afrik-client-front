import { Router, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';

import ServiceRules from './rules';
import ServiceS from './services';
import { IService } from '../../types/Service';
import authMiddleware from '../../middleware/auth';
import serviceCreation from '../../middleware/serviceCreation';

const serviceRoutes: Router = Router();
const serviceS = new ServiceS();

/**
 * @protected
 * @only ADMIN AUTHENTICATED
 */
serviceRoutes.post('/:email', ServiceRules.forCreation, authMiddleware(), serviceCreation, (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(HttpStatusCodes.BAD_REQUEST).json({
		errors: errors.array(),
		success: false
	});

	const payload = matchedData(req) as IService;
	const service = serviceS.create(payload);
	return service.then(s => {
		if (s) {
			res.status(HttpStatusCodes.CREATED).json({
				data: s,
				success: true
			});
		} else {
			res.status(HttpStatusCodes.BAD_REQUEST).json({
				data: null,
				success: false
			});
		}
	});

});

serviceRoutes.get('/', async (_req: Request, res: Response) => {
	const s = await serviceS.getAll();
	return res.status(HttpStatusCodes.OK).json({
		data: s,
		success: true
	});
});

serviceRoutes.get('/search/:keyword', async (req: Request, res: Response) => {
	const s = await serviceS.searchByKeyword(req.params.keyword);
	return res.status(HttpStatusCodes.OK).json({
		data: s,
		success: true
	});
});

export default serviceRoutes;
