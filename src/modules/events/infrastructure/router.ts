import { RouterFactory } from "tools/web/router.factory";
import EventsControllers from "./controllers";

export default RouterFactory(EventsControllers, {
    get: [["/latestEvents", "getLatestEvents"]],
});
