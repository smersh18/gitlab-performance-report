import prettyDate from "../src/prettyDate";
test('work hours should be calculated correctly', () => {
    let data: any = new Date(times[id].from)
    let data1: any = new Date(times[id].to)
  const hours1 =
      prettyDate(`${prettyDate(data)} - ${prettyDate(data1)}`)
  expect(hours1).toBe(16);
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