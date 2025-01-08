import Validators from ".";

export default {
    DatabaseId: () => Validators.Numbers.OneOrHigherInteger().required(),
    OptionalDatabaseId: () => Validators.Numbers.OneOrHigherInteger(),
};
