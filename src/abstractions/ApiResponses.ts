import { ValidationError, Result } from 'express-validator';
import { IUser, IBasicUser } from '../types/user';
import { IService } from '../types/Service';

export interface IStandardResponse {
	success: boolean;
}

export interface IBasicResponse extends IStandardResponse {
	data?: IUser | IBasicUser | IService | null;
}

export interface IGetListsResponse extends IStandardResponse {
	data?: IUser[] | IBasicUser[] | IService[] | [];
}

export interface IErrorResponse extends IStandardResponse {
	error: Result<ValidationError> | null
}
