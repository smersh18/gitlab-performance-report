import {getWorkingHours} from "../src/workHours";

describe("getWorkingHours", () => {

  it('should return work hours correctly inside week', () => {
    const workingHours =
        getWorkingHours(
            '2022-06-10T23:00:00+03:00',
            '2022-06-15T01:59:59+03:00',
        )
    expect(workingHours).toBe(16);
  });

  it('should return work hours correctly for the whole week', () => {
    const workingHours =
        getWorkingHours(
            '2022-06-14T08:00:00+03:00',
            '2022-06-21T01:59:59+03:00',
        )
    expect(workingHours).toBe(40);
  });

  it('should return work hours correctly for several months', () => {
    const workingHours =
        getWorkingHours(
            '2021-02-22T00:35:00+03:00',
            '2021-04-15T00:17:00+03:00',
        )
    expect(workingHours).toBe(304);
  });

  it('should fail when start date is after end date', () => {
    const workingHours =
        getWorkingHours(
            '2022-06-15T15:00:00+03:00',
            '2022-06-15T01:59:59+03:00',
        )
    expect(workingHours).toBe("error");
  });

});