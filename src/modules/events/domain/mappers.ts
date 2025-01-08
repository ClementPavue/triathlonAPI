import { Event } from "modules/events/domain/models";
import moment from "moment";


export function mapEvent(event: Event) {
    return {
        name: event.event_title,
        country: event.event_country,
        city: event.event_venue,
        prettyDate: moment(event.event_date, "YYYY_MM_DD").format("DD/MM/YYYY"),
        date: moment(event.event_date, "YYYY_MM_DD").unix()
    }
}