
export enum EventsNameCategory {
    T100 = "T100",
    WORLD_CHAMPIONSHIP = "World Triathlon Cup",
}

export interface EventCategory {
    cat_name: string;
    cat_id: number;
    cat_parent_id: number | null;
}

export interface EventSpecification {
    cat_name: string;
    cat_id: number;
    cat_parent_id: number | null;
}

export interface Event {
    event_id: number;
    event_title: string;
    event_slug: string;
    event_edit_date: string; // ISO 8601 formatted date string
    event_venue: string;
    event_country: string;
    event_latitude: number;
    event_longitude: number;
    event_date: string; // ISO 8601 formatted date string
    event_finish_date: string; // ISO 8601 formatted date string
    event_country_isoa2: string;
    event_country_noc: string;
    event_region_id: number;
    event_country_id: number;
    event_region_name: string;
    event_website: string;
    event_status: string;
    triathlonlive: boolean;
    event_categories: EventCategory[];
    event_specifications: EventSpecification[];
    event_flag: string;
    event_listing: string;
    event_api_listing: string;
}