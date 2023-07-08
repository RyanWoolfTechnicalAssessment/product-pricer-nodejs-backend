import supertest from 'supertest';
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from '../utils/app'
import mongoose from 'mongoose'
import {createProduct} from "../service/product.service";
import {signJwt} from "../utils/jwt.utils";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
const anotherUsersId = new mongoose.Types.ObjectId().toString();
import * as ProductService from '../service/product.service'
import * as UserService from "../service/user.service";

export const productPayload = {
    user:userId,
    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    description: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
    price: 879.99,
    image: "https://i.imgur.com/QlRphfQ.jpg"
}

export const updatedProductPayload = {
    "__v": 0,
    "_id": "myId",
    "createdAt": "2023/07/05",
    "description": "Updated - Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
    "image": "https://i.imgur.com/QlRphfQ.jpg",
    "price": 889.99,
    "productId": "myprodId",
    "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    "updatedAt": "2023/07/05",
    "user": "myuser",
}

export const updateToProductPayload = {
    "description": "Updated - Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
    "image": "https://i.imgur.com/QlRphfQ.jpg",
    "price": 889.99,
    "productId": "myprodId",
    "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
}

export const userPayload = {
    _id: userId,
    email: "jane.doe@example.com",
    name: "Jane Doe"
}

export const anotherUsersPayload = {
    _id: anotherUsersId,
    email: "jane.doe@example.com",
    name: "Jane Doe"
}
describe("product",() => {

    beforeAll(async () =>{
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    describe("get product route",() => {
        describe("given the product does not exist",() => {
            it("should return a 404", async () => {
                const productId = 'product-123';
                await supertest(app).get(`/api/products/${productId}`).
                expect(404);
            });
        })

        describe("given the product does exist",() => {
            it("should return a 200 status and product", async () => {
                const product = await createProduct(productPayload)
                const {body,statusCode} = await supertest(app).get(`/api/products/${product.productId}`);
                expect(statusCode).toBe(200);
                expect(body.productId).toBe(product.productId);
            });
        })
    })

    describe("create product route", () => {
        describe('given the user is not logged in', () => {
            it('should return a 401', async() =>{
                const { statusCode } = await supertest(app).post("/api/products");

                expect(statusCode).toBe(401);
            })
        })

        describe('given the user is logged in', () => {
            it('should return a 200 and create the product', async() =>{
                const jwt = signJwt(userPayload);

                const { statusCode,body } = await supertest(app).post('/api/products')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send(productPayload);

                expect(statusCode).toBe(200);

                expect(body).toEqual( {
                       "__v": 0,
                       "_id": expect.any(String),
                       "createdAt": expect.any(String),
                       "description": "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
                       "image": "https://i.imgur.com/QlRphfQ.jpg",
                       "price": 879.99,
                       "productId": expect.any(String),
                       "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
                       "updatedAt": expect.any(String),
                       "user": expect.any(String),
                })

            })
        })
    })

    describe("update product route", () => {
        describe('given the user is not logged in', () => {
            it('should return a 401', async() =>{
                const { statusCode } = await supertest(app).put("/api/products/1");

                expect(statusCode).toBe(401);
            })
        })

        describe('given the user logged in, but the product being updated belongs to another user', () => {
            it('should return a 403', async() =>{
                const jwt = signJwt(anotherUsersPayload);
                const findProductServiceMock = jest
                    .spyOn(ProductService,"findProduct")
                    // @ts-ignore
                    .mockReturnValueOnce(productPayload);
                await supertest(app).put(`/api/products/1`)
                    .set('Authorization', `Bearer ${jwt}`)
                expect(403);
            })
        })

        it("should return a 404", async () => {
            const productId = 'product-123';
            const jwt = signJwt(userPayload);
            await supertest(app).put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${jwt}`)
            expect(404);
        });

        describe('given the user is logged in', () => {
            it('should return a 200 and update the product', async() =>{
                const jwt = signJwt(userPayload);
                const product = await createProduct(productPayload)

                const { statusCode,body } = await supertest(app).put(`/api/products/${product.productId}`)
                    .set('Authorization', `Bearer ${jwt}`)
                    .send(updateToProductPayload);

                expect(statusCode).toBe(200);

                expect(body).toEqual( {
                    "__v": 0,
                    "_id": expect.any(String),
                    "createdAt": expect.any(String),
                    "description": "Updated - Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
                    "image": "https://i.imgur.com/QlRphfQ.jpg",
                    "price": 889.99,
                    "productId": expect.any(String),
                    "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
                    "updatedAt": expect.any(String),
                    "user": expect.any(String),
                })

            })
        })
    })

    describe("delete product route", () => {
        describe('given the user is not logged in', () => {
            it('should return a 401', async() =>{
                const { statusCode } = await supertest(app).delete("/api/products/1");

                expect(statusCode).toBe(401);
            })
        })

        describe('given the user logged in, but the product being deleted belongs to another user', () => {
            it('should return a 403', async() =>{
                const jwt = signJwt(anotherUsersPayload);
                const findProductServiceMock = jest
                    .spyOn(ProductService,"findProduct")
                    // @ts-ignore
                    .mockReturnValueOnce(productPayload);
                await supertest(app).put(`/api/products/1`)
                    .set('Authorization', `Bearer ${jwt}`)
                expect(403);
            })
        })

        it("should return a 404", async () => {
            const productId = 'product-123';
            const jwt = signJwt(userPayload);
            await supertest(app).delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${jwt}`)
            expect(404);
        });

        describe('given the user is logged in', () => {
            it('should return a 200 and delete the product', async() =>{
                const jwt = signJwt(userPayload);
                const product = await createProduct(productPayload)

                const { statusCode,body } = await supertest(app).delete(`/api/products/${product.productId}`)
                    .set('Authorization', `Bearer ${jwt}`)
                    .send();

                const getProductResponse = await supertest(app).get(`/api/products/${product.productId}`);
                expect(statusCode).toBe(200);
                expect(getProductResponse.statusCode).toBe(404);

            })
        })
    })
})