const KINVEY_KEYS = {
        // https://console.kinvey.com/apps/talk-in-code-17e06/environments/kid_HyNeqo4kZ/settings?section=api-keys
        APP_KEY: "kid_HyNeqo4kZ",
        APP_SECRET: "28b4751396ed4eb883f2bb33e2772a72",
        MASTER_SECRET: "a2662592b23b47ee9471eb69292f3568",
    }
    // http://devcenter.kinvey.com/rest/guides/security
const AUTH_STRING = encryptToBase64(KINVEY_KEYS.APP_KEY + ":" + KINVEY_KEYS.APP_SECRET),
    AUTH_MASTER = encryptToBase64(KINVEY_KEYS.APP_KEY + ":" + KINVEY_KEYS.MASTER_SECRET),
    AUTH_GUEST = encryptToBase64("guest:guest"),
    HOST_URL = "https://baas.kinvey.com";


const KINVEY = {
    // http://devcenter.kinvey.com/rest/guides/users#login
    USERS_HEADER: {
        "Authorization": "Basic " + AUTH_STRING,
        "X-Kinvey-API-Version": "3"
    },
    POSTS_HEADER: {
        "Authorization": "Basic " + AUTH_GUEST,
        "X-Kinvey-API-Version": "3"
    },
    URLS: {
        userLoginUrl: HOST_URL + "/user/" + KINVEY_KEYS.APP_KEY + "/login/",
        userRegisterUrl: HOST_URL + "/user/" + KINVEY_KEYS.APP_KEY,
        postsUrl: HOST_URL + "/appdata/" + KINVEY_KEYS.APP_KEY + "/posts/",
        commentsUrl: HOST_URL + "/appdata/" + KINVEY_KEYS.APP_KEY + "/comments/"
    }
}

function encryptToBase64(string) {
    let wordArray = CryptoJS.enc.Utf8.parse(string);
    let base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
}

export { KINVEY };