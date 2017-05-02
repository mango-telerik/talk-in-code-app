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
        console.log(val);
        const wrong = validator.validateString(val, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, TITLE_CHARS);
        if (wrong) {
            this.addError(wrong.message);
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
        if (!this.errors) {
            this.errors = [];
        }

        this.errors.push(message);
        console.log(this.errors);
        return this;
    }
}