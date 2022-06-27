import prettyDate from "./prettyDate";

function getTimes(data: any) {
  console.log("получаю точное время и дату");
  const hours: number = data.getHours().toString().padStart(2, '0')
  const minutes: number = data.getMinutes().toString().padStart(2, '0')

  return `${prettyDate(data)} ${hours}:${minutes}`
}

export default getTimes