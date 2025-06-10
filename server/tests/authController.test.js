import { jest } from "@jest/globals";

const findOne = jest.fn();
const create = jest.fn();

jest.unstable_mockModule("../src/models/User.js", () => ({
  default: { findOne, create },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: () => "tok" },
}));

const { register, login } = await import(
  "../src/controllers/authController.js"
);
import bcrypt from "bcryptjs";

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("authController", () => {
  beforeEach(() => {
    findOne.mockReset();
    create.mockReset();
  });

  test("register creates user", async () => {
    findOne.mockResolvedValue(null);
    create.mockResolvedValue({});
    const req = { body: { email: "a@b.pl", password: "secret1" } };
    const res = mockRes();
    await register(req, res);
    expect(create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ msg: "Zarejestrowano pomyślnie" });
    const args = create.mock.calls[0][0];
    expect(await bcrypt.compare("secret1", args.password)).toBe(true);
  });

  test("login returns token", async () => {
    const hash = await bcrypt.hash("pass123", 10);
    findOne.mockResolvedValue({ _id: "1", role: "user", password: hash });
    const req = { body: { email: "u", password: "pass123" } };
    const res = mockRes();
    await login(req, res);
    expect(res.json.mock.calls[0][0]).toHaveProperty("token", "tok");
  });
});
