import { jest } from "@jest/globals";

const create = jest.fn();
const find = jest.fn();
const findById = jest.fn();

jest.unstable_mockModule("../src/models/Booking.js", () => ({
  default: { create, find },
}));

jest.unstable_mockModule("../src/models/Show.js", () => ({
  default: { findById },
}));

const { createBooking } = await import(
  "../src/controllers/bookingController.js"
);

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const mockReq = (body) => ({
  body,
  user: { id: "u1" },
  app: { get: () => ({ to: () => ({ emit: () => {} }) }) },
});

describe("createBooking seat collision", () => {
  beforeEach(() => {
    create.mockReset();
    find.mockReset();
    findById.mockReset();
  });

  test("returns 400 when seat taken", async () => {
    findById.mockResolvedValue({
      _id: "s1",
      occurred: false,
      date: new Date(Date.now() + 3600000),
    });
    find.mockResolvedValue([{ seats: [{ row: 1, number: 1 }] }]);
    const req = mockReq({ showId: "s1", seats: [{ row: 1, number: 1 }] });
    const res = mockRes();
    await createBooking(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].msg).toMatch(
      "Miejsce 1-1 już zarezerwowane"
    );
  });
});
