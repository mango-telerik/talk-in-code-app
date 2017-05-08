import Element from "elementModel";
import * as validator from "validator";
import {
    TITLE_CHARS,
    TITLE_MIN_LENGTH,
    TITLE_MAX_LENGTH,
} from "constants";

export default class Post extends Element {
    constructor(author, content, likes, title, category) {
        super(author, content, likes);
        this.errors = null;
        this.title = title;
        this.category = category;
    }

    get title() {
        return this._title;
    }

    set title(val) {
        let message = null;
        if (typeof val !== "string" || val.length < 3) {
            message = "Title must be text with more than 3 symbols!";
        } else {
            val
                .replace(/&/g, "&amp;")
                .replace(/>/g, "&gt;")
                .replace(/</g, "&lt;")
                .replace(/"/g, "&quot;");
        }

        if (message) {
            this.addError(message);
        } else {
            this._title = val;
        }
    }

    get category() {
        return this._category;
    }

    set category(val) {
        // validate
        this._category = val;
    }

    // creates and adds errors to the errors property
    addError(message) {
        super.addError(message);
    }
}