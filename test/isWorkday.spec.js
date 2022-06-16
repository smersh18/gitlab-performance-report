import isWorkDay from "../src/isWorkday";
import moment from "moment";

test('work hours should be calculated correctly', () => {
    let data = moment("2022-06-18T14:58:50+00:00")
    const hours =
        isWorkDay(data)
    expect(hours).toBe(false);
});
test('work hours error', () => {
    let data = moment("2021-03-09T14:58:50+00:00")
    const hours = isWorkDay(data)
    expect(hours).toBe(true);
});
test('work hours week', () => {
    let data = moment("2021-03-09T14:58:50+00:00")
    const hours =
        isWorkDay(data)
    expect(hours).toBe(true);
});
test('work hours months', () => {
    let data = moment("2021-03-09T14:58:50+00:00")
    const hours =
        isWorkDay(data)
    expect(hours).toBe(true);
});