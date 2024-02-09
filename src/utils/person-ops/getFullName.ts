import { TPresonDataResponse } from "~/types"
import cn from 'clsx'

export const getFullName = (personData: TPresonDataResponse): string => {
  return personData.data.customService?.data.baseInfo
    ? cn(
      personData.data.customService?.data.baseInfo.firstName,
      personData.data.customService?.data.baseInfo.middleName,
      personData.data.customService?.data.baseInfo.lastName,
    )
    : (personData.message || 'Full Name ERR #0 (no data)')
}
