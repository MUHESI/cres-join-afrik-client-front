import HttpStatusCodes from 'http-status-codes';
import { IncomingHttpHeaders } from 'http';
import { RequestHandler } from 'express';
import UserService from '../components/user/services';

const userService = new UserService();

const getTokenFromHeaders = (headers: IncomingHttpHeaders) => {
	const header = headers.authorization as string;

	if (!header)
		return header;

	return header.split(' ')[1];
};

export const getAdditonalParamsFromHeader = (header: IncomingHttpHeaders): string =>
	header.protection as string;

const authMiddleware: (() => RequestHandler) = (() => (req, res, next) => {

	if (getAdditonalParamsFromHeader(req.headers) === 'IGNORE')
		next();

	const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || '';
	const hasAccess = userService.verifyToken(token);

	hasAccess.then(a => {
		if (!a)
			return res.status(HttpStatusCodes.UNAUTHORIZED).json({
				message: 'No access granted'
			});
		return next();
	});
});

export default authMiddleware;
