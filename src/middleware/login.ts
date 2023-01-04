/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import User from '../components/user/model';

import Request from '../types/Request';

const loginMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user)
			return res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({
					success: false,
					reason: 'User not found',
					u: null
				});
		if (!user.active) {
			return res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({
					success: false,
					reason: 'User account is not verified, resend verification code ?',
					u: null
				});
		}

		return next();

	} catch (error) {
		return res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				success: false,
				reason: 'Server error',
				u: null
			});
	}
};

export default loginMiddleware;
