import { ControllerFactory } from "tools/web/controller.factory";
import { Val } from "tools/validation";

import { EventsNameCategory } from "../domain/models";
import EventsService from "../domain/service";

const getLatestEvents = ControllerFactory(
    {
        query: Val.object({
            name: Val.string()
                .valid(...Object.keys(EventsNameCategory))
        }).required(),
        forbidEmptyResponse: true,
    },
    async ({
        query: { name },
        user: { userId, groupId },
    }) => {
        return EventsService.getLatestEvents(name as EventsNameCategory);
    }
);

export default { getLatestEvents };
