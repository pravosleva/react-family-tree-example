import { TPresonDataResponse } from "~/types"

export const getBirtgdayDate = ({ personData }: {
  personData: TPresonDataResponse;
}): {
  value: Date | null;
  inCurrentYear: Date | null;
} => {
  let value = null
  let inCurrentYear = null
  const id = personData.data.id
  const regex = /(?<=\[)\d{1,2}-\d{2}-\d{4}(?=\])/g
  const found = id.match(regex)
  const currentYear = new Date().getFullYear()

  // NOTE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
  // NOTE: new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
  if (!!found && !!found[0]) {
    const [uiDay, uiMonth, uiYear] = found[0].split('-')
    const normalizedDay = Number(uiDay)
    const normalizedMonthIndex = Number(uiMonth) - 1
    const normalizedYear = Number(uiYear)

    value = new Date(normalizedYear, normalizedMonthIndex, normalizedDay)
    inCurrentYear = new Date(currentYear, normalizedMonthIndex, normalizedDay)
  }

  return {
    value,
    inCurrentYear,
  }
}
