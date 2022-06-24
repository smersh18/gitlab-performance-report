function spaceIfNull(obj: any) {
    if (!obj) {
        obj = " "
    }

    return obj
}
export default spaceIfNull