import { TriathlonOrgClient } from "tools/client/triathlonOrg.client";
import { EventsNameCategory } from "./models";
import { mapEvent } from "./mappers";

const NUMBER_OF_EVENTS = 5;
async function getLatestEvents(name: EventsNameCategory) {
    const client = new TriathlonOrgClient();
    return client.getLatestEvents(name, NUMBER_OF_EVENTS).then(events => events?.map(mapEvent) || []);
}
export default { getLatestEvents };