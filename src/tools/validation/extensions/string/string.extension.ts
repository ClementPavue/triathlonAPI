import Joi from "@hapi/joi";

const stringExtension: Joi.Extension = {
    base: Joi.string(),
    name: "string",
    language: {},
    rules: [],
};

export { stringExtension };
