import Joi from "@hapi/joi";
import NumbersValidationPresets from "../../numbers.preset";

describe("Numbers validation presets", () => {
    describe("ZeroOrHigherInteger", () => {
        it("Should match a positive integer starting from one or no value", () => {
            const payloads = [1, 123, undefined];
            const validator = Joi.compile(NumbersValidationPresets.ZeroOrHigherInteger()).options({ abortEarly: false });
            payloads.forEach(payload => {
                const { value, error } = validator.validate(payload);
                expect(value).toBe(payload);
                expect(error).toBeFalsy();
            });
        });

        it("should reject everything else", () => {
            const payloads = [-1, "lol", { n: 0 }];
            const validator = Joi.compile(NumbersValidationPresets.ZeroOrHigherInteger()).options({ abortEarly: false });
            payloads.forEach(payload => {
                const { value, error } = validator.validate(payload);
                expect(value).toEqual(payload);
                expect(error).toBeDefined();
            });
        });
    });
});
