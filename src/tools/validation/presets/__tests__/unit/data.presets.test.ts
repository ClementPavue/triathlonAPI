import Joi from "@hapi/joi";
import DataValidationPresets from "../../data.preset";

describe("Data validation presets", () => {
    describe("DatabaseId", () => {
        it("Should match a positive integer starting from one", () => {
            const payloads = [1, 123, 1000];
            const validator = Joi.compile(DataValidationPresets.DatabaseId()).options({ abortEarly: false });
            payloads.forEach(payload => {
                const { value, error } = validator.validate(payload);
                expect(value).toBe(payload);
                expect(error).toBeFalsy();
            });
        });

        it("should reject everything else", () => {
            const payloads = [-1, "lol", { n: 0 }];
            const validator = Joi.compile(DataValidationPresets.DatabaseId()).options({ abortEarly: false });
            payloads.forEach(payload => {
                const { value, error } = validator.validate(payload);
                expect(value).toEqual(payload);
                expect(error).toBeDefined();
            });
        });
    });
});
