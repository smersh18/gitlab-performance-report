

import {isWorkDay} from "../src/workHours";

import moment from "moment";

test('should be false', () => {
    let date = moment("2022-06-18T14:58:50+00:00")

    expect(isWorkDay(date)).toBe(false);
});

// TODO: rename it
test('should be true', () => {
    let data = moment("2021-03-09T14:58:50+00:00")
    const hours = isWorkDay(data)

    expect(hours).toBe(true);
});

// TODO: rename it
test('should be true', () => {
    let data = moment("2021-03-09T14:58:50+00:00")
    const hours = isWorkDay(data)

    expect(hours).toBe(true);
});

// TODO: rename it
test('should be true', () => {
    let data = moment("2021-03-09T14:58:50+00:00")
    const hours = isWorkDay(data)
    expect(hours).toBe(true);
});