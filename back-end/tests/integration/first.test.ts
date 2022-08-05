import app from '../../src/app.js';
import supertest from 'supertest';
import {faker} from '@faker-js/faker'
import { prisma } from '../../src/database.js';

describe("POST /recommendations", () => {

    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations`
    });
    
    const body = {
        'name': faker.lorem.slug(3),
        'youtubeLink': "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    }

    it('given a valid recommendation, should return 201', async ()=> {
        const result = await supertest(app).post('/recommendations').send(body);
        expect(result.status).toEqual(201);
    });

    it('given a valid recommendation with duplicate name, should return 409', async ()=> {
        await supertest(app).post('/recommendations').send(body);
        const result = await supertest(app).post('/recommendations').send(body);
        expect(result.status).toEqual(409);
    });

    it('given a invalid recommendation, should return 422', async () => {
        const invalidBody = {...body, invalidField: 'invalidField'};
        const result = await supertest(app).post('/recommendations').send(invalidBody);
        expect(result.status).toEqual(422);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
})