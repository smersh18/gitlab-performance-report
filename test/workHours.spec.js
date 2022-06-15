import getWorkingHours from "../src/workHours";
test('work hours should be calculated correctly', () => {
  const hours1 =
      getWorkingHours(
          '2022-06-10T23:00:00+03:00',
          '2022-06-15T01:59:59+03:00',
      )
  expect(hours1).toBe(16);
});
test('work hours error', () => {
    const hours1 =
        getWorkingHours(
            '2022-06-15T15:00:00+03:00',
            '2022-06-15T01:59:59+03:00',
        )
    expect(hours1).toBe("error");
});
test('work hours week', () => {
    const hours1 =
        getWorkingHours(
            '2022-06-14T08:00:00+03:00',
            '2022-06-21T01:59:59+03:00',
        )
    expect(hours1).toBe(40);
});
test('work hours months', () => {
    const hours1 =
        getWorkingHours(
            '2021-02-22T00:35:00+03:00',
            '2021-04-15T00:17:00+03:00',
        )
    expect(hours1).toBe(304);
});