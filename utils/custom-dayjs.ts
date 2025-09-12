import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import localizedFormat from "dayjs/plugin/localizedFormat"
import duration from "dayjs/plugin/duration"

import "dayjs/locale/en-ca"
import "dayjs/locale/fr-ca"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
dayjs.extend(duration)

dayjs.locale("fr-ca")
dayjs.tz.setDefault("America/Toronto")

export default dayjs
