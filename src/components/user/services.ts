/* eslint-disable no-console */
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import dotenv from 'dotenv';
import { UpdateWriteOpResult } from 'mongoose';
import { IUser, IBasicUser, Sex } from '../../types/user';
import User from './model';
import { sendConfirmationEmail, sendRecorverEmail_ } from '../../../config/nodemailer.config';

interface MyToken {
	name: string;
	exp: number;
	iat: number;
}
export default class UserService {
	constructor() {
		dotenv.config();
	}

	private readonly _saltRounds = process.env.GEN_SALT || 10

	private readonly _jwtSecret = process.env.SECRET || '0.rfyj3n9nzh'

	static get userAttributes(): string[] {
		return ['_id', 'email', 'username', 'roles'];
	}

	private static _user: IUser

	static get user(): IUser {
		return UserService._user;
	}

	async register({ email, password, role = 'FREELANCER' }: IBasicUser): Promise<IUser | null> {
		try {
			const confirmationCode = jwt.sign({
				email,
			}, this._jwtSecret,
				{
					expiresIn: '24h'
				});
			const hash = await bcrypt.hash(password, this._saltRounds);
			const roles_ = [role];
			const u = await User.create({ email, password: hash, roles: roles_, confirmationCode });
			if (u) this.sendEmail(email, email, confirmationCode, u._id);
			return this.getUserById(u!._id);
		} catch (error) {
			return null;
		}
	}

	// pqxsctohruvvnayj

	async renewPassword(newPassword: string, currentPassword: string,  email: string): Promise<{
		data: UpdateWriteOpResult;
		message: string;
	}> {
		try {
			const user = await User.findOne({ email });

			if (!user) return { data: null, message: 'User not found' };

			// compare pswd
			const compare = await bcrypt.compare(currentPassword, user.password);

			if (!compare) {
				return {
					data: null,
					message: 'the current password is wrong'
				};
			}

			const hash = await bcrypt.hash(newPassword, this._saltRounds);
			const u = await User.updateOne({
				_id: user._id,
			}, {
				$set: {
					password: hash
				}
			});
			// TODO SEND EMAIL
			// if (u) this.sendEmail(email, email, confirmationCode, u._id);
			return {
				data: u,
				message: 'Password updated successfully'
			};
		} catch (error) {
			return null;
		}
	}

	async verifyCode(confirmationCode: string, idUser: string): Promise<{
		data: IUser;
		message: string;
	}> {
		try {
			const user = await User.findById(idUser);
			const expires = jwtDecode<MyToken>(user.confirmationCode).exp;
			const now = Date.now();
			if (!user || user.confirmationCode !== confirmationCode) return { data: null, message: 'User not found or confirmation code incorrect' };
			// VERIFY VALIDITY OF THE CONFIRMATION CODE BEFORE THE FINAL RESPONSE
			if (now - expires < 0) return { data: null, message: 'This token has expired, please request another one' };
			if (user.confirmationCode === confirmationCode) {
				user.active = true; // SET THE USER STATUS TO TRUE
				await User.updateOne({
					_id: user._id,
				}, {
					$set: {
						active: true,
					}
				});
				return { data: user, message: 'Code confirmed successfully' };
			};
			return {
				data: null,
				message: 'Unknown'
			};
		} catch (error) {
			return null;
		}
	}

	async resetConfirmationCode(email: string): Promise<{
		data: IUser;
		message: string;
	}> {
		try {
			const user = await User.findOne({ email });
			if (!user) return { data: null, message: 'User not found' };
			if (user.active) return { data: null, message: 'This user is already activated, please log in' };
			const confirmationCode = jwt.sign({
				email: user.email,
			}, this._jwtSecret,
				{
					expiresIn: '24h'
				});
			user.confirmationCode = confirmationCode;
			this.sendEmail(user.email, user.email, confirmationCode, user._id);
			return {
				data: user,
				message: 'An email was sent',
			};
		} catch (error) {
			return {
				data: null,
				message: 'Something went wrong',
			};
		}
	}

	async forgotPassword(email: string) {
		try {
			const user = await User.findOne({ email });
			if (!user) return { data: null, message: 'User not found' };
			// SEND AN EMAIL WITH LINK
			this.sendRecorverEmail(email, user._id);
			return {
				data: user,
				message: 'An email was sent',
			};
		} catch (error) {
			return {
				data: null,
				message: 'Something went wrong',
			};
		}
	}

	async completeSignup(idUser: string, {
		fName = '',
		lName = '',
		avatar = '',
		country = '',
		languages = [],
		dateOfBirth,
		bio = '',
		sex = Sex.N
	}: IUser) {
		try {
			const updatedUser = await User.updateOne({
				_id: idUser,
			}, {
				$set: {
					fName,
					lName,
					avatar,
					country,
					languages,
					dateOfBirth,
					bio,
					sex
				}
			}, {
				upsert: true,
			});
			return updatedUser;
		} catch (error) {
			return null;
		}
	}

	async login({ email, password }: IUser): Promise<{ token: string, user: IUser, message: string, success: boolean }> {
		const u = await User.findOne({ email });
		const { _id } = u!;

		const verified = await bcrypt.compare(password, u?.password);
		if (u && verified) return { success: true, token: jwt.sign({ _id, email, expiresIn: '48h' }, this._jwtSecret), user: u, message: 'Logged in successfully' };
		return { success: false, token: null, user: null, message: 'Wrong password or email address' };
	}

	async getUserById(id: string): Promise<IUser> {
		const user = await User.findById(id).populate('jobs') ;
		return user;
	}

	verifyToken(token: string) {
		return new Promise((resolve, _reject) => {
			jwt.verify(token, this._jwtSecret, (err, decoded) => {
				if (err) {
					resolve(false);
					return;
				}

				const userFound: any = User.findById((<any>decoded)._id);
				UserService._user = userFound;
				resolve(true);

			});
		}) as Promise<boolean>;
	}

	sendEmail(username: string, email: string, confirmationCode: string, idUser: string) {
		try {
			sendConfirmationEmail(
				username,
				email,
				confirmationCode,
				idUser
			).then(success => console.log('SUCCEED', success));
		} catch (error) {
			console.error('ERROR', error);
			// To send Error
		}
	}

	sendRecorverEmail(email: string, idUser: string) {
		try {
			const verificationCode = jwt.sign({
				email,
			}, this._jwtSecret,
				{
					expiresIn: '24h'
				});
			sendRecorverEmail_(
				email,
				idUser,
				verificationCode
			).then(success => console.log('SUCCEED', success));
		} catch (error) {
			console.error('ERROR', error);
			// To send Error
		}
	}
}
