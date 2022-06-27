export function prettyDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().substring(2)

    return `${day}.${month}.${year}`;
}

export function getTimes(data: any) {
  console.log("получаю точное время и дату");
  const hours: number = data.getHours().toString().padStart(2, '0')
  const minutes: number = data.getMinutes().toString().padStart(2, '0')

  return `${prettyDate(data)} ${hours}:${minutes}`
}

