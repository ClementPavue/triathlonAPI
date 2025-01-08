import { Val } from "..";

export default {
    ZeroOrHigherInteger: () => Val.number().integer().min(0),
    OneOrHigherInteger: () => Val.number().integer().min(1),
    Percentage: () => Val.number().integer().min(0).max(100),
};
