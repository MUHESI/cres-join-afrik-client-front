/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import User from '../components/user/model';

import Request from '../types/Request';
import { Roles } from '../types/user';

const serviceCreation = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
	const { email } = req.params;
	try {
		const user = await User.findOne({ email });
		if (!user)
			return res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({
					success: false,
					reason: 'User not found, dangrous action',
					u: null
				});
		if (!user.roles.includes(Roles.ADMIN) && !user.roles.includes(Roles.SUPERADMIN)) {
			return res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({
					success: false,
					reason: 'Only admins can create a service',
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

export default serviceCreation;
