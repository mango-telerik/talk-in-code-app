const USERNAME_CHARS = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_.",
    USERNAME_MIN_LENGTH = 3,
    USERNAME_MAX_LENGTH = 30,
    ADMINS = ["admin", "zach"],
    TITLE_CHARS = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_.",
    TITLE_MIN_LENGTH = 3,
    TITLE_MAX_LENGTH = 45,
    CREDENTIAL = {
        ADMIN: "admin",
        REGULAR: "regular"
    },
    USERNAME_LOCAL_STORAGE = "signed-in-user-username",
    AUTH_KEY_LOCAL_STORAGE = "signed-in-user-auth-key",
    ID_LOCAL_STORAGE = "signed-in-user-id";

export {
    USERNAME_CHARS,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    TITLE_CHARS,
    TITLE_MIN_LENGTH,
    TITLE_MAX_LENGTH,
    ADMINS,
    CREDENTIAL,
    USERNAME_LOCAL_STORAGE,
    AUTH_KEY_LOCAL_STORAGE,
    ID_LOCAL_STORAGE
};