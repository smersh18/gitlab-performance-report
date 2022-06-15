import moment from 'moment'

function isWorkday(date: any): boolean {
    const dayOfWeek: number = date.day()
    return dayOfWeek !== 0 && dayOfWeek !== 6
}

function getWorkingHours(fromDate: string, toDate: string): number | string {
    let workHours: number = 0
    let from: any = moment(fromDate)
    let to: any = moment(toDate)
    if (from.isSame(to, "day")) {
        if (to.hour() < from.hour()) {
            return "error"
        }
        if (from.hour() < 9 && to.hour() < 9) {
            return 0
        } else {
            if (to.hour() - from.hour() > 8) {
                return 8
            } else {
                return to.hour() - from.hour()
            }
        }
    }
    if (from.hour() >= 18) {
        workHours = workHours + 0
    } else if (isWorkday(from) === true) {
        if (from.hour() <= 9) {
            workHours = workHours + 8
        } else {
            workHours = workHours + 18 - from.hour()
        }
    }
    from.add(1, "day")
    while (from.isSame(to, "day") === false) {
        if (isWorkday(from) === true) {
            workHours = workHours + 8
        }
        from.add(1, "day")
    }
    if (isWorkday(to) === true) {
        if (to.hour() <= 9) {
            workHours = workHours + 0
        } else if (to.hour() >= 18) {
            workHours = workHours + 8
        } else if (to.hour() >= 9) {
            workHours = workHours + to.hour() - 9
        }
    }
    return workHours
}
export default getWorkingHours