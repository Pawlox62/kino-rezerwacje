import { jest } from "@jest/globals";

const find = jest.fn();
const deleteMany = jest.fn();
const updateMany = jest.fn();

jest.unstable_mockModule("../src/models/Show.js", () => ({
  default: { find, updateMany },
}));

jest.unstable_mockModule("../src/models/Booking.js", () => ({
  default: { deleteMany },
}));

const cleanup = (await import("../src/utils/cleanup.js")).default;

describe("cleanupExpiredBookings", () => {
  beforeEach(() => {
    find.mockReset();
    deleteMany.mockReset();
    updateMany.mockReset();
  });

  test("updates finished and occurred flags", async () => {
    const shows = [
      {
        _id: "1",
        movie: { duration: 60 },
        date: new Date(Date.now() - 7200000),
        finished: false,
        occurred: false,
      },
    ];
    const populate = jest.fn().mockResolvedValue(shows);
    find.mockReturnValue({ populate });

    await cleanup();
    expect(deleteMany).toHaveBeenCalled();
    expect(updateMany).toHaveBeenCalledTimes(2);
  });
});
