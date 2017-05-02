import * as validator from "validator";

export default class Element {
    constructor(author, content, likes) {
        this.author = author;
        this.content = content;
        this.likes = likes;
    }

    get author() {
        return this._author;
    }

    set author(val) {
        // validate
        this._author = val;
    }

    get content() {
        return this._content;
    }

    set content(val) {
        // validate
        this._content = val;
    }

    get likes() {
        return this._likes;
    }

    set likes(val) {
        // validate
        this._likes = val;
    }
}