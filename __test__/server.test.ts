import request from 'supertest';
import { TEST_CASES } from '../config/database';
import App from '../src/app';

beforeEach(() => jest.useFakeTimers());

describe('Server testing', () => {
	const app = new App('test');
	beforeAll(async () => await app.init(TEST_CASES.USER));
	it('Request baseUrl should return Server running!', async () => {
		const result = await request(app.express).get('/').send();

		expect(result.status).toBe(200);
		expect(result.body.message).toBe('Server running!');
	});
});
