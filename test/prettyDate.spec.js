import {prettyDate} from "../src/util/dateUtil";

describe("prettyDate", () => {

  it('should return 09.03.21', () => {
    let date = new Date("2021-03-09T14:58:50+00:00")
    const data = prettyDate(date)
    expect(data).toBe("09.03.21");
  });

  it('should return 09.04.21', () => {
    let date = new Date("2021-04-09T14:58:50+00:00")
    const data = prettyDate(date)
    expect(data).toBe("09.04.21");
  });

});
