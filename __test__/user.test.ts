import request from 'supertest';
import User from '../src/components/user';
import App from '../src/app';
import { TEST_CASES } from '../config/database';

beforeEach(() => jest.useFakeTimers());

describe('The user feature', () => {
	const app = new App('test');
	beforeAll(async () => await app.init(TEST_CASES.USER));
	it('Connects properly the super user', () => {
		// Tests for login
		const user = {
			email: 'super@admin.com',
			password: 'super@admin.com'
		};

	});
	it('Handles errors when data are not correct', () => {

	});
});
