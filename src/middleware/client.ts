import { NextFunction, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { getAdditonalParamsFromHeader } from './auth';
import Request from '../types/Request';
import UserService from '../components/user/services';
import { Roles } from '../types/user';

const clientMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {

	if (getAdditonalParamsFromHeader(req.headers) === 'IGNORE')
		next();

	// Get user after he was been athenticated
	const user = await UserService.user;

	// Check if the user exists
	if (!user) {
		return res.status(HttpStatusCodes.NOT_FOUND).json({
			message: 'invalid_user_token'
		});
	}

	// Check if the user is a client -- SUPERADMIN -- ADMIN
	if (
		!Object.values(user.roles).includes(Roles.CLIENT) &&
		!Object.values(user.roles).includes(Roles.ADMIN) &&
		!Object.values(user.roles).includes(Roles.SUPERADMIN)
	) {
		return res.json({
			message: 'Sorry, only clients can update jobs.',
			success: false,
		});
	}
	return next();
};

export default clientMiddleware;
