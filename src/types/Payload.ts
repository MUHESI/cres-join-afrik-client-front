import { Roles } from './user';

/**
 * @description Payload Object to be signed and verified by JWT. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userId:string
 */
type payload = { userId: string };

/**
 * @global payload for pagination
 */
export type Params = {
	limit?: number;
	page?: number;
	role?: Roles
}

export type Query = {
	skills?: string[];
	languages?: string[];
	country?: string;
	isFinished?: boolean;
	experienceLevel?: string;
	price?: number;
}

export default payload;
