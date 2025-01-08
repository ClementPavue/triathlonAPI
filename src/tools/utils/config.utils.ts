import { readFileSync } from "fs";

export class Config {
    private static _instance: Config;

    private readonly _values: {
        debug: boolean;
        triathlonOrgAPI: {
            baseUrl: string,
            apiKey: string
        },
        port: number;
    };

    private constructor() {
        this._values = Object.create(null) as typeof this._values;
    }

    private static get instance() {
        if (!Config._instance) {
            Config._instance = new Config();
        }
        return Config._instance;
    }

    public static load(path_str: string) {
        return Object.assign(
            Config.instance._values,
            JSON.parse(readFileSync(path_str).toString()) as typeof Config.instance._values
        );
    }

    public static get values() {
        return Config.instance._values;
    }

    public static get<K extends keyof (typeof Config)["instance"]["_values"]>(
        key: K
    ): (typeof Config)["_instance"]["_values"][K] {
        return Config.instance._values[key];
    }
}
