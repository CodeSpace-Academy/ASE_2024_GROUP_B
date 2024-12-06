// Import the function to test
const { POST } = require("./app/api/authorisation/signup/route");

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

// Mock MongoDB client
jest.mock('./lib/mongodb', () => ({
    __esModule: true,
    default: {
      db: () => ({
        collection: () => ({
          findOne: jest.fn(),
          insertOne: jest.fn(),
        }),
      }),
    },
  }));

describe("Sign-up Route", () => {
  let req;

  beforeEach(() => {
    req = {
      json: jest.fn(),
    };
  });

  it("should return 400 if email or password is missing", async () => {
    // Simulate request with missing email
    req.json.mockResolvedValueOnce({ email: "", password: "password123" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    // Simulate request with missing password
    req.json.mockResolvedValueOnce({ email: "test@example.com", password: "" });
    const res2 = await POST(req);
    expect(res2.status).toBe(400);
  });

  it('should return 409 if the user already exists', async () => {
    const mockDb = await require('./lib/mongodb').default;
    const collectionMock = mockDb.db().collection();
  
    // Simulate an existing user
    collectionMock.findOne.mockResolvedValueOnce({ email: 'test@example.com' });
    req.json.mockResolvedValueOnce({ email: 'test@example.com', password: 'password123' });
  
    const res = await POST(req);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "User  already exists" });
  });


  it('should return 201 if the user is created successfully', async () => {
    const mockDb = await require('./lib/mongodb').default;
    const collectionMock = mockDb.db().collection();
  
    // Mock the db call to return null (user does not exist)
    collectionMock.findOne.mockResolvedValueOnce(null);
    collectionMock.insertOne.mockResolvedValueOnce({ insertedId: '12345' });
  
    // Mock bcrypt hash function
    require('bcrypt').hash.mockResolvedValueOnce('hashedPassword');
  
    // Simulate a new user
    req.json.mockResolvedValueOnce({ email: 'newuser@example.com', password: 'password123' });
  
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ message: "User  registered successfully" });
  });

  it('should return 500 if there is an internal server error', async () => {
    const mockDb = await require('./lib/mongodb').default;
    const collectionMock = mockDb.db().collection();
  
    // Mock the db to throw an error
    collectionMock.insertOne.mockRejectedValueOnce(new Error('DB error'));
  
    req.json.mockResolvedValueOnce({ email: 'newuser@example.com', password: 'password123' });
  
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});
