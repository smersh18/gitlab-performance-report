import prettyDate from "../src/prettyDate";

// TODO: rename it

test('should be correctly date 09.03.21', () => {
    let data = new Date("2021-03-09T14:58:50+00:00")
    const hours1 = prettyDate(data)
    expect(hours1).toBe("09.03.21");
});
// TODO: rename it

test('should be correctly date 09.04.21', () => {
    let data1 = new Date("2021-04-09T14:58:50+00:00")
    const hours1 = prettyDate(data1)
    expect(hours1).toBe("09.04.21");
});