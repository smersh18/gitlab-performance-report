function isWorkDay(date: any): any {
    const dayOfWeek: number = date.day()
    return dayOfWeek !== 0 && dayOfWeek !== 6
}

export default isWorkDay