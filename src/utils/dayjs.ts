import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isoWeek from 'dayjs/plugin/isoWeek'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import 'dayjs/locale/ko'

dayjs.extend(duration)
dayjs.extend(isoWeek)
dayjs.extend(LocalizedFormat)
dayjs.extend(advancedFormat)
dayjs.extend(updateLocale)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)
dayjs.locale('ko')

export default dayjs
export type Dayjs = dayjs.Dayjs
