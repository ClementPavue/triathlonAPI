enum Messages {
    EXPIRED_API_KEY = "Provided API key is expired",
    INCOMPLETE_TWO_FACTOR_AUTH = "User did not complete two-factor authentication",
    INSUFFICIENT_CREDENTIALS = "The user did not provide any authentication credentials as necessary to access the target resource.",
    INVALID_CREDENTIALS = "The user did provide authentication credentials as necessary to access the target resource, but those were invalid.",
    INSUFFICIENT_PERMISSIONS = "You do not have sufficient permissions to access this resource.",
    DEACTIVATED_ACCOUNT = "Your account has been deactivated",
}

export default {
    Messages,
};
