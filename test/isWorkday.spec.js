import {isWorkDay} from "../src/workHours";

import moment from "moment";

test('work hours should be calculated correctly', () => {
  let date = moment("2022-06-18T14:58:50+00:00")

  expect(isWorkDay(date)).toBe(false);
});

// TODO: rename it
test('XXX', () => {
  let data = moment("2021-03-09T14:58:50+00:00")
  const hours = isWorkDay(data)

  expect(hours).toBe(true);
});

// TODO: rename it
test('XXXXddd', () => {
  let data = moment("2021-03-09T14:58:50+00:00")
  const hours = isWorkDay(data)

  expect(hours).toBe(true);
});

// TODO: rename it
test('No sense', () => {
  let data = moment("2021-03-09T14:58:50+00:00")
  const hours = isWorkDay(data)
  expect(hours).toBe(true);
});