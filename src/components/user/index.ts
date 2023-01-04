import { Router, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';


import HttpStatusCodes from 'http-status-codes';
import userRules from './rules';
import UserService from './services';
import { IUser, Roles } from '../../types/user';
import loginMiddleware from '../../middleware/login';

// https://remarkable-sherbet-559798.netlify.app/

const userRouter: Router = Router();
const userService = new UserService();
const sendResponse = (payload: {
	message: string,
	data: IUser,
}, idUser: string) => {
	const state = payload.data ? 'SUCCESS' : 'FAILURE';
	const role = payload.data ? payload.data.roles[0] : '';
	return `
        <html>
            <img src=".png" height="120px" /> <br/>
            <h2>${state}</h2><br/>
			<img src="https://res.cloudinary.com/pacyl20/image/upload/v1627857099/logoJ_ue631j" alt="cres-logo" />
            <p>${payload.message}</p></br/>
            ${state === 'SUCCESS' ? `
                <a href="https://remarkable-sherbet-559798.netlify.app/${role === Roles.FREELANCER ? 'signup-freelancer' : 'signup-client'}/${idUser}">
                    <button style="background-color: red; border: none; color: white; padding: 10px; border-radius: 5px">
                        LOGIN HERE
                    </button>
                </a>
            ` : `
                <a href="https://remarkable-sherbet-559798.netlify.app/reset-code/">
                    <button style="background-color: red; border: none; padding: 10px; color: white; border-radius: 5px">
                        RESEND CODE
                    </button>
                </a>
            `}
        </html>
    `;
};

userRouter.post('/register', userRules.forRegister, (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const payload = matchedData(req) as IUser;

	const user = userService.register(payload);

	return user.then(u => {
		if (u) {
			res.status(HttpStatusCodes.CREATED).json({
				u,
				sucess: true
			});
		} else {
			res.status(HttpStatusCodes.BAD_REQUEST).json({
				u,
				sucess: false,
				// reason: 'duplication'
			});
		}
	});
});

userRouter.post('/login', userRules.forLogin, loginMiddleware, (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const payload = matchedData(req) as IUser;
	const response = userService.login(payload);

	return response.then(r => res.status(r.user ? HttpStatusCodes.OK : HttpStatusCodes.UNAUTHORIZED).json(r));
});

userRouter.put('/complete_signup/:idUser', userRules.forCompleteSignup, (req: Request, res: Response) => {
	const errors = validationResult(req);
	const { idUser } = req.params;
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const payload = matchedData(req) as IUser;

	const user = userService.completeSignup(idUser, payload);

	return user.then(u => {
		if (u) {
			res.status(HttpStatusCodes.CREATED).json({
				u,
				sucess: true,
				message: 'An email that expires in 24 hours has been sent, please confirm your account'
			});
		} else {
			res.status(HttpStatusCodes.BAD_REQUEST).json({
				u,
				sucess: false,
				// reason: 'duplication'
			});
		}
	});
});

userRouter.get('/confirm/:idUser/:confirmationCode', async (req: Request, res: Response) => {
	const { confirmationCode, idUser } = req.params;
	const user = userService.verifyCode(confirmationCode, idUser);
	const u = await user;
	if (u) {
		res.writeHead(HttpStatusCodes.OK, { 'Content-Type': 'text/html' });
		res.end(`${sendResponse(u, idUser)}`);
	} else {
		res.status(HttpStatusCodes.BAD_REQUEST).json({
			data: null,
			message: 'Internal servor error',
			sucess: false,
		});
	}
});

userRouter.post('/reset/:email', async (req: Request, res: Response) => {
	const { email } = req.params;
	const u = await userService.resetConfirmationCode(email);
	if (u.data) {
		res.status(HttpStatusCodes.OK).json({
			data: u.data,
			success: true,
			message: u.message
		});
	} else {
		res.status(HttpStatusCodes.BAD_REQUEST).json({
			data: null,
			message: 'Internal servor error',
			sucess: false,
		});
	}
});

userRouter.post('/password/recorver/', userRules.forRecoverPassword, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const { email } = req.body;
	const u = await userService.forgotPassword(email);
	if (u.data)
		return res.status(HttpStatusCodes.OK).json({
			data: u.data,
			success: true,
			message: u.message
		});
	return res.status(HttpStatusCodes.BAD_REQUEST).json({
		data: null,
		message: 'Internal servor error',
		sucess: false,
	});
});


//  this is ignored when an user change its password >> userRules.forResetPassword,

userRouter.put('/password/renew/:email', userRules.forResetPassword, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(HttpStatusCodes.BAD_REQUEST).json(errors.array());

	const { newPassword, currentPassword } = req.body;
	const { email } = req.params;

	const u = await userService.renewPassword(newPassword, currentPassword, email);
	if (u.data)
		return res.status(HttpStatusCodes.OK).json({
			data: u.data,
			success: true,
			message: u.message
		});
	return res.status(HttpStatusCodes.BAD_REQUEST).json({
		data: null,
		message: 'Internal servor error',
		sucess: false,
	});
});

userRouter.get('/:idUser', async (req: Request, res: Response) => {
	const { idUser } = req.params;
	const user: IUser = await userService.getUserById(idUser);
	if (user) return res.status(HttpStatusCodes.OK).json({
		success: true,
		user,
	});
	return res.status(HttpStatusCodes.NOT_FOUND).json({
		success: false,
		user: null,
		message: 'User not found'
	});
});

export default userRouter;
