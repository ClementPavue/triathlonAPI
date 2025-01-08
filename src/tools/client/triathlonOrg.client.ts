import axios, { AxiosError } from "axios";
import { EventsNameCategory } from "modules/events/domain/models";
import { Config } from "tools/utils/config.utils";
import { debugLog, errorLog } from "tools/utils/log.utils";
import { Event } from "modules/events/domain/models";

export class TriathlonOrgClient {

    private _getHeadersForRequest() {
        return {
            "apikey": Config.get("triathlonOrgAPI").apiKey,
        };
    }
    private async getRequest<T>(endpoint: string, params?: object) {
        if (!Config.get("triathlonOrgAPI").apiKey) {
            throw new Error(`no apiKey configured`);
        }

        const url: string = `${Config.get("triathlonOrgAPI").baseUrl}${endpoint}`;
        debugLog(`Calling GET ${url} with params ${JSON.stringify(params)}`);
        const now = Date.now();

        return axios
            .get<T>(url, {
                headers: this._getHeadersForRequest(),
                params
            })
            .then(r => {
                debugLog(`GET ${url} finised in ${(Date.now() - now) / 1000} seconds`);
                return r.data;
            })
            .catch((e: AxiosError) => {
                errorLog(e.response?.data ? JSON.stringify(e.response?.data, null, 2) : e);
                throw new Error(`Error ${e.response?.status} calling GET ${url} after ${(Date.now() - now) / 1000} seconds`);
            });
    }
    
    async getLatestEvents(name: EventsNameCategory, limit: number): Promise<Event[]> {

        const endpoint = `/events`;
        return (await this.getRequest<{data: Event[]}>(endpoint, { name, order: "desc", per_gage: limit })).data;
    }
}