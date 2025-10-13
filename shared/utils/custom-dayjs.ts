import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import localizedFormat from "dayjs/plugin/localizedFormat.js"
import duration from "dayjs/plugin/duration.js"

import frCa from "dayjs/locale/fr-ca.js"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
dayjs.extend(duration)

dayjs.locale(frCa)
dayjs.tz.setDefault("America/Toronto")

export default dayjs
