export function toLocalISOString (
  {date, dateString}: {
    date?: Date
    dateString?: string
  }
) {
  const tDate = date || (dateString && new Date(dateString))
  let str = ''

  if (tDate) {
    const tzo = -tDate.getTimezoneOffset()
    const dif = tzo >= 0 ? '+' : '-'
    const pad = function(num: number) {
      return (num < 10 ? '0' : '') + num;
    };

    str = tDate.getFullYear()
      + '-' + pad(tDate.getMonth() + 1)
      + '-' + pad(tDate.getDate())
      + 'T' + pad(tDate.getHours())
      + ':' + pad(tDate.getMinutes())
      + ':' + pad(tDate.getSeconds())
      + dif + pad(Math.floor(Math.abs(tzo) / 60))
      + ':' + pad(Math.abs(tzo) % 60);
  }
  return str
}
