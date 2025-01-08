import { noEmojisRegExp } from "tools/utils/regex.utils";
import { Val } from "..";

const MAX_SIZE_STRING_IN_DB = 50;
export default {
    DatabaseString: (maxLength = MAX_SIZE_STRING_IN_DB) => Val.string().max(maxLength, "utf8"),
    NoEmojis: () => Val.string().regex(noEmojisRegExp, "no emojis"),
};
