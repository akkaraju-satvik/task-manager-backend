const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, userOne, configDatabase} = require('./fixtures/db')

beforeEach(configDatabase)

test('should sign up new user', async function() {
    const response = await request(app).post('/users').send({
        name: 'Satvik',
        email: 'sakkaraju3@gmail.com',
        password: 'Satvikk01'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({user: {name: 'Satvik', email: 'sakkaraju3@gmail.com'}, token: user.tokens[0].token})

    expect(user.password).not.toBe('wut@123')
})

test('should sign in existing user', async function() {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toMatch(user.tokens[user.tokens.length - 1].token)
})

test('should not be able to log in', async function() {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'blahblahblah'
    }).expect(400)
})

test('Should get profile', async function() {
    await request(app).get('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({}).expect(200)
})

test('Should not get profile', async function() {
    await request(app).get('/users/me').send().expect(401)
})

test('Should not delete profile', async function() {
    await request(app).delete('/users/me').send({}).expect(401)
})

test('Should delete profile', async function() {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({}).expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should upload avatar', async function() {
    await request(app).post('/users/me/avatar').set('Authorization', `Bearer ${userOne.tokens[0].token}`).attach('avatar', 'tests/fixtures/profile-pic.jpg').expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toStrictEqual(expect.any(Buffer))
})

test('should update user fields', async () => {
    await request(app).patch('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({name: "Satvik Akkaraju"}).expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe("Satvik Akkaraju")
})

test('should not update invalid user field', async () => {
    await request(app).patch('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({location: "India"}).expect(400)
})