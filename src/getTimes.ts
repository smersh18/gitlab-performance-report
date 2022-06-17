function getTimes(data: any) {
  // TODO: rename it
  const day1: number = data.getDate().toString().padStart(2, '0')
    const month1: number = (data.getMonth() + 1).toString().padStart(2, '0')
    const year1: number = data.getFullYear().toString().substring(2)
    const hours1: number = data.getHours().toString().padStart(2, '0')
    const minutes1: number = data.getMinutes().toString().padStart(2, '0')

    return `${day1}.${month1}.${year1} ${hours1}:${minutes1}`
}

export default getTimes