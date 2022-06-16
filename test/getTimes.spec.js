import getTimes from "../src/getTimes";

test('work hours should be calculated correctly', () => {
    let data = new Date("2022-06-18T14:58:50+00:00")
    const dateAndHours =
        getTimes(data)
    expect(dateAndHours).toBe("18.06.22 17:58");
});
test('work hours error', () => {
    let data = new Date("2021-03-09T14:58:50+00:00")
    const dateAndHours = getTimes(data)
    expect(dateAndHours).toBe("09.03.21 17:58");
});
test('work hours week', () => {
    let data = new Date("2021-03-09T14:58:50+00:00")
    const dateAndHours =
        getTimes(data)
    expect(dateAndHours).toBe("09.03.21 17:58");
});
