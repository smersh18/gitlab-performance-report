import prettyDate from "../src/prettyDate";
test('work hours should be calculated correctly', () => {
    let data = new Date("2021-03-09T14:58:50+00:00")
    let data1 = new Date("2021-04-09T14:58:50+00:00")
  const hours1 =
      prettyDate(`${prettyDate(data)} - ${prettyDate(data1)}`)
  expect(hours1).toBe("09.02.21 - 09.03.21");
});
// test('work hours error', () => {
//     let data: any = new Date()
//     let data1: any = new Date()
//     const hours1 =
//         prettyDate(`${prettyDate(data)} - ${prettyDate(data1)}`)
//     expect(hours1).toBe("error");
// });
// test('work hours week', () => {
//     let data: any = new Date()
//     let data1: any = new Date()
//     const hours1 =
//         prettyDate(`${prettyDate(data)} - ${prettyDate(data1)}`)
//     expect(hours1).toBe(40);
// });
// test('work hours months', () => {
//     let data: any = new Date(times[id].from)
//     let data1: any = new Date(times[id].to)
//     const hours1 =
//         prettyDate(`${prettyDate(data)} - ${prettyDate(data1)}`)
//     expect(hours1).toBe(304);
// });