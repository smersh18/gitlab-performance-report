import prettyDate from "./prettyDate";

function getTimes(data: any) {
  const hours1: number = data.getHours().toString().padStart(2, '0')
  const minutes1: number = data.getMinutes().toString().padStart(2, '0')

  return `${prettyDate(data)} ${hours1}:${minutes1}`
}

export default getTimes