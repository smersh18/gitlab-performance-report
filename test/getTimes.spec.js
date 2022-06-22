import getTimes from "../src/getTimes";
describe("getWorkingHours", () => {

    it('should return work hours correctly inside week', () => {
        let data = new Date("2022-06-18T14:58:50+00:00")
        const dateAndHours = getTimes(data)
        expect(dateAndHours).toBe("18.06.22 17:58");
    });

    it('should return work hours correctly for the whole week', () => {
        let data = new Date("2021-03-09T14:58:50+00:00")
        const dateAndHours = getTimes(data)
        expect(dateAndHours).toBe("09.03.21 17:58");
    });

    it('should return work hours correctly for several months', () => {
        let data = new Date("2021-03-09T14:58:50+00:00")
        const dateAndHours = getTimes(data)
        expect(dateAndHours).toBe("09.03.21 17:58");
    });

});