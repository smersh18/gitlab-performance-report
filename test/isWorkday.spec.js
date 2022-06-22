import {isWorkDay} from "../src/workHours";
import moment from "moment";
describe("getWorkingHours", () => {

    it('should return false', () => {
        let date = moment("2022-06-18T14:58:50+00:00")
        const boolean = isWorkDay(date)
        expect(boolean).toBe(false);
    });

    it('should return true', () => {
        let date = moment("2021-03-09T14:58:50+00:00")
        const boolean = isWorkDay(date)
        expect(boolean).toBe(true);
    });

    it('should return true', () => {
        let date = moment("2021-03-09T14:58:50+00:00")
        const boolean = isWorkDay(date)
        expect(boolean).toBe(true);
    });

    it('should return true', () => {
        let date = moment("2021-03-09T14:58:50+00:00")
        const boolean = isWorkDay(date)
        expect(boolean).toBe(true);
    });

});