import { Coin } from "modules/_common/domain/models/coin.model";
import { CountryList } from "tools/client/countryClient";
import { CryptoRateFetcher } from "tools/client/cryptoRateFetcher";
import { KnownCoinList } from "tools/client/knownCoinList";
import { PlatformList } from "tools/client/platformList";
import { BitcoinPlatform } from "tools/platforms/bitcoinPlatform";
import { EthereumPlatform } from "tools/platforms/ethereumPlatform";
import { Config } from "tools/utils/config.utils";
import ScoringService from "../../domain/service";
import { BlockchainHashMatcherClient } from "../../../../tools/client/blockchainHashMatcher";

jest.mock("tools/api/cppeth.facade.ts");
jest.mock("tools/api/scoresci.facade.ts");
jest.mock("tools/client/cryptoRateFetcher.ts");
jest.mock("tools/client/entityCache.ts");
jest.mock("tools/client/knownCoinList.ts");
jest.mock("tools/client/countryClient.ts");
jest.mock("tools/client/temporalScoringEventsClient.ts");

let bitcoinPlatform: BitcoinPlatform;
beforeAll(async () => {
    const configPath = "./conf.json";
    await Config.load(configPath);
    await CryptoRateFetcher.init();
    BlockchainHashMatcherClient.init();
    await PlatformList.init();
    await CountryList.init();
    await KnownCoinList.init();

    bitcoinPlatform = new BitcoinPlatform("BITCOIN");
    bitcoinPlatform.init();
});

describe("Scoring service", () => {
    test("Custom group parsing", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            4,
            1
        );
        const customGroupItem = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Custom list");
        expect(customGroupItem).toHaveLength(1);
        expect(customGroupItem[0].name).toBe("My list");
        expect(customGroupItem[0].score).toBe(10);
    });

    test("AI parsing with threshold too high", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            4,
            1
        );
        const AIItem = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Darkweb");
        expect(AIItem).toHaveLength(0);
    });

    test("AI parsing", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            5,
            1
        );
        const AIItem = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Darkweb");
        expect(AIItem).toHaveLength(1);
        expect(AIItem[0].name).toBe("AI identified Darkweb of 17ccoczRnNf3EjUgYCHnarRq6LgF3k6YJ9");
        expect(AIItem[0].score).toBe(6);
    });

    test("AI parsing with AI deactivated", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const AIItem = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Darkweb");
        expect(AIItem).toHaveLength(0);
    });

    test("Behavioral type parsing", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            5,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Mixing pattern");
        expect(item).toHaveLength(1);
        expect(item[0].name).toBe("Mixing pattern");
        expect(item[0].type).toBe("Mixing pattern");
        expect(item[0].score).toBe(15);
    });

    test("Behavioral type overriding by company", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Mixing pattern");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(42);
        expect(item[0].type).toBe("Mixing pattern");
        expect(item[0].name).toBe("Mixing pattern");
    });

    test("Large unnamed entity parsing override", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Large unnamed entity");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(42);
        expect(item[0].type).toBe("Large unnamed entity");
        expect(item[0].name).toBe("Unnamed entity of 17ccoczRnNf3EjUgYCHnarRq6LgF3k6YJ9");
    });

    test("Large unnamed entity parsing", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            4,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.type === "Large unnamed entity");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(50);
        expect(item[0].type).toBe("Large unnamed entity");
        expect(item[0].name).toBe("Unnamed entity of 17ccoczRnNf3EjUgYCHnarRq6LgF3k6YJ9");
    });

    test("Named entity parsing", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            4,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.name === "BitFlyer.jp");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(80);
        expect(item[0].type).toBe("Exchange");
    });

    test("Named entity parsing with entity score override", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            5,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.name === "BitFlyer.jp");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(1);
        expect(item[0].type).toBe("Exchange");
    });

    test("Named entity parsing with type score override", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.name === "Bitcoin.co.id");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(100);
        expect(item[0].type).toBe("Exchange");
    });

    test("Named entity parsing with type and entity score override", async () => {
        // We priorize the entity override
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.details.filter(s => s.name === "BitFlyer.jp");
        expect(item).toHaveLength(1);
        expect(item[0].score).toBe(1);
        expect(item[0].type).toBe("Exchange");
    });

    test("Risk indicator behavioral type", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.risks.filter(
            r => r.settings.parameters.referenceName === "Mixing pattern"
        );
        expect(item).toHaveLength(1);
        expect(item[0]).toEqual({
            settings: {
                id: 1,
                type: "BEHAVIOR",
                parameters: {
                    referenceId: 69,
                    referenceName: "Mixing pattern",
                    threshold: 0,
                },
            },
            causes: [
                {
                    amount: 20.0395661,
                    amountUsd: 2003956.61,
                    percentage: 0.02,
                    countries: [],
                    name: "Mixing pattern",
                    type: "Mixing pattern",
                    score: 42,
                    severity: "MEDIUM_RISK",
                },
            ],
        });
    });

    test("Risk indicator type", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.risks.filter(
            r => r.settings.parameters.referenceName === "Exchange"
        );
        expect(item[0].causes).toHaveLength(2);
        expect(item[0]).toEqual({
            settings: {
                id: 2,
                type: "ENTITY_TYPE",
                parameters: {
                    referenceId: 51,
                    referenceName: "Exchange",
                    threshold: 0,
                },
            },
            causes: [
                {
                    referenceAddress: "bc1qdl753ur9ucwa3cgfrud2nqvu7k69dykk3cwwx6g64a5szn3xw92sp8mc7a",
                    amount: 23.3492387,
                    amountUsd: 2334923.87,
                    percentage: 0.03,
                    countries: ["UNITED KINGDOM"],
                    name: "BitFlyer.jp",
                    type: "Exchange",
                    score: 1,
                    severity: "CRITICAL_RISK",
                },
                {
                    referenceAddress: "3PwYnrhpVedKowgKS6LFyzdm6y3vQ19Hip",
                    amount: 9.5333099,
                    amountUsd: 953330.99,
                    percentage: 0.01,
                    countries: [],
                    name: "Bitcoin.co.id",
                    type: "Exchange",
                    score: 100,
                    severity: "NO_RISK",
                },
            ],
        });
    });

    test("Risk country type", async () => {
        const addressHash = "bc1qxwt9p6luscqed2pmvvyfkjwduvwl0jn4hhmzwr";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "INCOMING",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );
        const item = addressScoring.analysis.incoming.result.risks.filter(
            r => r.settings.parameters.referenceName === "UNITED KINGDOM"
        );

        expect(item[0].causes).toHaveLength(1);
        expect(item[0]).toEqual({
            settings: {
                id: 3,
                type: "ENTITY_COUNTRY",
                parameters: {
                    referenceId: 468,
                    referenceName: "UNITED KINGDOM",
                    threshold: 0,
                },
            },
            causes: [
                {
                    referenceAddress: "bc1qdl753ur9ucwa3cgfrud2nqvu7k69dykk3cwwx6g64a5szn3xw92sp8mc7a",
                    amount: 23.3492387,
                    amountUsd: 2334923.87,
                    percentage: 0.03,
                    name: "BitFlyer.jp",
                    countries: ["UNITED KINGDOM"],
                    type: "Exchange",
                    score: 1,
                    severity: "CRITICAL_RISK",
                },
            ],
        });
    });

    test("ASSIGN scoring Binance address", async () => {
        const addressHash = "1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        bitcoinPlatform.init();
        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "ASSIGNED",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );

        expect(addressScoring.analysis.assigned.result.details.entity.riskAssessment).toStrictEqual({
            score: 20,
            severity: "HIGH_RISK",
        });
        expect(addressScoring.analysis.assigned.result.details.customEntity).toStrictEqual({
            score: 75,
            severity: "LOW_RISK",
            origin: "CUSTOM_ENTITY",
            justification: "I just like them",
        });

        const risks = addressScoring.analysis.assigned.result.risks.filter(r => r.parameters.referenceName === "Exchange");
        expect(risks).toHaveLength(1);
        expect(risks[0]).toStrictEqual({
            id: 2,
            type: "ENTITY_TYPE",
            parameters: {
                referenceId: 51,
                referenceName: "Exchange",
                threshold: 0,
            },
        });
    });

    test("ASSIGN scoring on address with type customisation", async () => {
        const addressHash = "0x00bdb5699745f5b860228c8f939abf1b9ae374ed";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };
        const platform: EthereumPlatform = new EthereumPlatform("ETHEREUM");
        platform.init();
        const addressScoring = await ScoringService.getScoring(platform, "ASSIGNED", "ADDRESS", addressHash, btc, 1172, 6, 1);

        expect(addressScoring.analysis.assigned.result.details.entity.riskAssessment).toStrictEqual({
            score: 90,
            severity: "LOW_RISK",
        });
        expect(addressScoring.analysis.assigned.result.details.customEntity).toStrictEqual({
            score: 100,
            severity: "NO_RISK",
            origin: "CUSTOM_ENTITY_TYPE",
            justification: "I like exchanges",
        });

        const risks = addressScoring.analysis.assigned.result.risks.filter(r => r.parameters.referenceName === "Exchange");
        expect(risks).toHaveLength(1);
        expect(risks[0]).toStrictEqual({
            id: 2,
            type: "ENTITY_TYPE",
            parameters: {
                referenceId: 51,
                referenceName: "Exchange",
                threshold: 0,
            },
        });
    });

    test("ASSIGN scoring on single address in a scored group", async () => {
        const addressHash = "bc1qdma3d3d7thv3pu3ukj7lexwpekrpd2vgtxysya";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        bitcoinPlatform.init();
        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "ASSIGNED",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );

        expect(addressScoring.analysis.assigned.result.details.entity).toBeFalsy();

        expect(addressScoring.analysis.assigned.result.details.customEntity).toStrictEqual({
            score: 1,
            severity: "CRITICAL_RISK",
            origin: "SCORED_LIST",
            justification: "This is pointless",
        });
        expect(addressScoring.analysis.assigned.result.risks).toHaveLength(0);

        const walletScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "ASSIGNED",
            "WALLET",
            addressHash,
            btc,
            1172,
            6,
            1
        );

        expect(walletScoring.analysis.assigned.result).toBeFalsy();
    });

    test("ASSIGN scoring on an AI entity", async () => {
        const addressHash = "3479gSjwpQXmw2PtuDqyTRqLk5b8e1KLJi";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        bitcoinPlatform.init();
        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "ASSIGNED",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            5,
            1
        );

        expect(addressScoring.analysis.assigned.result.details.entity.aiDetails).toStrictEqual({
            entityTypeClassifier: [
                {
                    type: "Exchange",
                    percentage: 88.09,
                },
                {
                    type: "Gambling",
                    percentage: 5.71,
                },
                {
                    type: "Service",
                    percentage: 2.62,
                },
                {
                    type: "Darkweb",
                    percentage: 1.63,
                },
                {
                    type: "Mining pool",
                    percentage: 1.11,
                },
                {
                    type: "Mixing service",
                    percentage: 0.85,
                },
            ],
        });

        expect(addressScoring.analysis.assigned.result.score).toBe(100); //because of the type exchange override
        expect(addressScoring.analysis.assigned.result.details.entity.riskAssessment.score).toBe(50); //because of the type exchange override
        expect(addressScoring.analysis.assigned.result.details.entity.name).toBe("Unnamed Wallet");

        const risks = addressScoring.analysis.assigned.result.risks.filter(r => r.parameters.referenceName === "Exchange");
        expect(risks).toHaveLength(1);
        expect(risks[0]).toStrictEqual({
            id: 2,
            type: "ENTITY_TYPE",
            parameters: {
                referenceId: 51,
                referenceName: "Exchange",
                threshold: 0,
            },
        });
    });

    test("ASSIGN scoring on an AI entity but with threshold too high", async () => {
        const addressHash = "3479gSjwpQXmw2PtuDqyTRqLk5b8e1KLJi";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        bitcoinPlatform.init();
        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "ASSIGNED",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            4,
            1
        );

        expect(addressScoring.analysis.assigned.result.details.entity.aiDetails).toBeFalsy();

        const risks = addressScoring.analysis.assigned.result.risks.filter(r => r.parameters.referenceName === "Exchange");
        expect(risks).toHaveLength(0);
    });

    test("ASSIGN scoring on an AI entity but with AI deactivated", async () => {
        const addressHash = "3479gSjwpQXmw2PtuDqyTRqLk5b8e1KLJi";
        const btc: Coin = {
            id: 0,
            blockchain: "BITCOIN",
            chainId: null,
            name: "BITCOIN",
            icon: "",
            symbol: "BTC",
            decimals: 8,
            isDeprecated: false,
        };

        const addressScoring = await ScoringService.getScoring(
            bitcoinPlatform,
            "ASSIGNED",
            "ADDRESS",
            addressHash,
            btc,
            1172,
            6,
            1
        );

        expect(addressScoring.analysis.assigned.result.details.entity.aiDetails).toBeFalsy();

        const risks = addressScoring.analysis.assigned.result.risks.filter(r => r.parameters.referenceName === "Exchange");
        expect(risks).toHaveLength(0);
    });

    test("ALL coin scoring with dexTrades aggregated", async () => {
        const addressHash = "04de0c236d2022c33784fa39f635f052bd127f3a";
        const coin: Coin = {
            id: 0,
            blockchain: "",
            chainId: "ALL",
            name: "",
            icon: "",
            symbol: "",
            decimals: 8,
            isDeprecated: false,
        };
        const platform: EthereumPlatform = new EthereumPlatform("ETHEREUM");
        platform.init();
        const addressScoring = await ScoringService.getScoring(platform, "INCOMING", "ADDRESS", addressHash, coin, 1172, 6, 1);
        const res = addressScoring.analysis.incoming.result;
        const Bitstamp = res.details.find(r => r.name === "Bitstamp.net");
        expect(Bitstamp).toEqual({
            referenceAddress: "0xb9ee1e551f538a464e8f8c41e9904498505b49b0",
            amount: 1500000,
            amountUsd: 1500000,
            percentage: 75,
            name: "Bitstamp.net",
            countries: [],
            type: "Exchange",
            score: 100,
            severity: "NO_RISK",
        });
        const BinanceMulti = res.details.find(r => r.name === "Binance.com through  multiple DEXs");
        expect(BinanceMulti.percentage).toBe(20.5);
        const BinanceUni2 = res.details.find(r => r.name === "Binance.com through Uniswap v2");
        expect(BinanceUni2.percentage).toBe(0.18);
    });
});
