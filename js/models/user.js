import * as validator from "validator";
import {
    USERNAME_CHARS,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    ADMINS,
    CREDENTIAL
} from "constants";

export default class User {
    constructor(username, password, email) {
        this.credential = CREDENTIAL.REGULAR;
        this.errors = null;
        this.username = username;
        this.passHash = this.createHash(password);
        this.email = email;
        this.posts = 0;
        this.comments = 0;
    }

    get username() {
        return this._username;
    }

    set username(val) {
        const wrong = validator.validateString(val, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_CHARS);
        if (wrong) {
            this.addError(wrong.message);
        } else {
            this._username = val;
            if (ADMINS.indexOf(this.username) >= 0) {
                this.credential = CREDENTIAL.ADMIN;
            } else {
                this.credential = CREDENTIAL.REGULAR;
            }
        }
    }

    get passHash() {
        return this._passHash;
    }

    set passHash(val) {
        this._passHash = val;
    }

    get email() {
        return this._email;
    }

    set email(val) {
        const wrong = validator.validateEmail(val);
        if (wrong) {
            this.addError(wrong.message);
        } else {
            this._email = val;
        }
    }

    get posts() {
        return this._posts;
    }

    set posts(val) {
        // validate
        this._posts = val;
    }

    get comments() {
        return this._comments;
    }

    set comments(val) {
        // validate
        this._comments = val;
    }

    // creates and adds errors to the errors property
    addError(message) {
        if (!this.errors) {
            this.errors = [];
        }

        this.errors.push(message);
        console.log(this.errors);
        return this;
    }

    // creates passhash based on username and password
    createHash(password) {
        // validate
        const wrong = validator.validatePassword(password);
        if (wrong) {
            this.addError(wrong.message);
        }
        // convert password to hash
        return CryptoJS.SHA1(this.username + password).toString();
    }
}