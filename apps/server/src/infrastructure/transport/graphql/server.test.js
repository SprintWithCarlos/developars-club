const request = require('supertest')
const testServer = require('./server')
const { faker } = require('@faker-js/faker')

describe('server', () => {
  let server, url, createUser
  beforeAll(async () => {
    ;({ server, url } = await testServer.listen(5000))
  })
  beforeEach(() => {
    createUser = () => ({
      query: `mutation CreateUser($user: UserInput) {
          createUser(user: $user) {
            id,
            email,
            username,
          }
        }`,
      variables: {
        user: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      },
    })
  })
  afterAll(async () => {
    await server?.close()
  })
  it('returns hello with the provided name', async () => {})
  describe('Primary Path', () => {
    it('should create a new user', async () => {
      const response = await request(url).post('/').send(createUser())
      expect(response.errors).toBeUndefined()
      expect(response.body?.data).toMatchObject({
        createUser: {
          id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
        },
      })
    })
    it('should return an array of users with length === n if user is created before', async () => {
      const newUser = await request(url).post('/').send(createUser())

      expect(newUser.statusCode).toBe(200)
      const response = await request(url)
        .post('/')
        .send({
          query: `
           query Query {
            listUsers {
              id,
              username,
              email
            }
          }
          `,
        })
      expect(response.body?.data.listUsers).toBeInstanceOf(Array)
      response.body?.data.listUsers.map((item) => {
        return expect(item).toMatchObject({
          id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
        })
      })
    })
    it('should return user data after querying by id', async () => {
      let username
      const newUser = await request(url).post('/').send(createUser())

      ;({ username, id } = newUser.body.data?.createUser)

      expect(newUser.statusCode).toBe(200)
      const response = await request(url)
        .post('/')
        .send({
          query: `query GetUserById($getUserByIdId: ID!) {
            getUserById(id: $getUserByIdId) {
              id,
              username
            }
          }
          `,
          variables: {
            getUserByIdId: id,
          },
        })
      expect(response.body?.data).toMatchObject({
        getUserById: {
          id: expect.any(String),
          username,
        },
      })
    })
    it.todo('should update user summary')
  })
  describe('Exception Path', () => {
    it.todo("Throw error at user creation when validation don't pass")
  })
})
