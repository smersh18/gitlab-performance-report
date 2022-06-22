import getTimes from "../src/getTimes";
describe("getWorkingHours", () => {

    it('should return 18.06.22 17:58', () => {
        let data = new Date("2022-06-18T14:58:50+00:00")
        const dateAndHours = getTimes(data)
        expect(dateAndHours).toBe("18.06.22 17:58");
    });

    it('should return 09.03.21 17:58', () => {
        let data = new Date("2021-03-09T14:58:50+00:00")
        const dateAndHours = getTimes(data)
        expect(dateAndHours).toBe("09.03.21 17:58");
    });

    it('should return 09.05.21 17:58', () => {
        let data = new Date("2021-05-09T14:58:50+00:00")
        const dateAndHours = getTimes(data)
        expect(dateAndHours).toBe("09.05.21 17:58");
    });

});