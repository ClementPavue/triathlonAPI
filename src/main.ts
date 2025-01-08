import express, { Router } from "express";
import { Config } from "tools/utils/config.utils";
import { createBodyParsingHandler } from "tools/middleware/body.middleware";
import { createErrorHandler } from "tools/middleware/error.middleware";
import { createNotFoundHandler } from "tools/middleware/notfound.middleware";
import { errorLog, log } from "tools/utils/log.utils";
import { unary } from "tools/utils/fp.utils";
import path from "path";
import { EventsRouter } from "modules/events";

process.env.TZ = "UTC";

// eslint-disable-next-line @typescript-eslint/require-await
const main = async (argc: number, argv: string[]) => {
    const isHealthy = true;

    let configPath = "./conf.json";
    if (argc > 2 && typeof argv[2] === "string") {
        configPath = path.isAbsolute(argv[2]) ? argv[2] : path.join(process.cwd(), argv[2]);
    }

    try {
        Config.load(configPath);
    } catch (error) {
        errorLog(error, "FATAL ERROR");
        log("Process exiting");
        process.exit(2);
    }

    log("All dependencies has been initialized");

    const healthCheckRouter: Router = Router().get("/health", (_, res) => {
        if (isHealthy) {
            res.status(200).send("OK");
        } else {
            res.status(503).send("KO");
        }
    });

    const versionRouter: Router = Router().get("/version", (_, res) => {
        const packageConfig = require("../package.json") as unknown;
        res.status(200).send(packageConfig["version"]);
    });

    const v1Router: Router = Router().use("/", healthCheckRouter, versionRouter).use("/events", EventsRouter);

    express()
        .use(createBodyParsingHandler())
        .use("/v1", v1Router)

        .use(createErrorHandler())
        .use(createNotFoundHandler())
        .disable("x-powered-by")
        .listen(Config.values.port, () => log(`⚡️[server]: Server is running on port ${Config.values.port}`));
};

main(process.argv.length, process.argv).catch(unary(errorLog));
