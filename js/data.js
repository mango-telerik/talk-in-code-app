import * as validator from "validator";
import * as jsonRequester from "requester";
import { User } from "userModel";
import { Post } from "postModel";
import {
    USERNAME_CHARS,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_LOCAL_STORAGE,
    AUTH_KEY_LOCAL_STORAGE,
    ID_LOCAL_STORAGE
} from "constants";
import { KINVEY } from "kinvey";

/* Users */
function register(reqUser) {
    // if created user has errors - reject
    const message = reqUser.errors;
    if (message) {
        return Promise.reject(message.join("<br/>"));
    }

    // create options
    const options = {
        data: {
            username: reqUser.username,
            password: reqUser.passHash,
            email: reqUser.email,
            posts: 0,
            comments: 0,
            credential: reqUser.credential
        },
        headers: KINVEY.USERS_HEADER
    }
    console.log(KINVEY.USERS_HEADER);

    // provide url
    const url = KINVEY.URLS.userRegisterUrl;

    // make request and return promise
    return jsonRequester.post(url, options)
        .then(function(res) {
            return {
                username: res.username,
                id: res._id
            };
        });
}

function signIn(user) {
    // check provided username
    var error = validator.validateString(user.username, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_CHARS);
    if (error) {
        return Promise.reject(error.message);
    }

    // create options
    const options = {
        data: {
            username: user.username,
            password: CryptoJS.SHA1(user.username + user.password).toString()
        },
        headers: KINVEY.POSTS_HEADER
    };

    // provide url
    const url = KINVEY.URLS.userLoginUrl;

    // make request, set user to local storage and return promise
    return jsonRequester.post(url, options)
        .then(res => {
            localStorage.setItem(USERNAME_LOCAL_STORAGE, res.username);
            localStorage.setItem(AUTH_KEY_LOCAL_STORAGE, res._kmd.authtoken);
            localStorage.setItem(ID_LOCAL_STORAGE, res._id);
            return res;
        });
}

function signOut() {
    // remove user data from local storage
    var promise = new Promise(function(resolve, reject) {
        localStorage.removeItem(USERNAME_LOCAL_STORAGE);
        localStorage.removeItem(AUTH_KEY_LOCAL_STORAGE);
        localStorage.removeItem(ID_LOCAL_STORAGE);
        resolve();
    });
    return promise;
}

function currentUser() {
    // check if user is logged in
    return !!localStorage.getItem(USERNAME_LOCAL_STORAGE) &&
        !!localStorage.getItem(AUTH_KEY_LOCAL_STORAGE);
}

/* Posts */

function addPost(reqPost) {
    // if created post has errors - reject
    const message = reqPost.errors;
    if (message) {
        return Promise.reject(message.join("<br/>"));
    }

    // create options
    const options = {
        data: {
            title: reqPost.title,
            author: { username: reqPost.author.username },
            content: reqPost.content,
            category: reqPost.category,
            likes: 0
        },
        headers: KINVEY.POSTS_HEADER
    }

    // provide url
    const url = KINVEY.URLS.postsUrl;

    // make request and return promise
    return jsonRequester.post(url, options)
        .then(function(res) {
            return {
                title: res.title,
                author: res.author.username,
                id: res._id
            };
        });
}

function getPosts(category) {
    // check if category exists

    // create options
    const options = {
        headers: KINVEY.POSTS_HEADER
    }

    // if category provided create query
    let query = category ? `?query={"category":${category}}` : "";

    // provide url
    const url = KINVEY.URLS.postsUrl + query;

    // make the request and return promise
    return jsonRequester.get(url, options)
        .then(function(res) {
            return res;
        })
}

/* Comments */
function addCommentToPost(id, reqComment) {
    // if created comment has errors
    const message = reqComment.errors;
    if (message) {
        return Promise.reject(message.join("<br/>"));
    }

    // create options
    const options = {
        data: {
            author: { username: reqComment.author.username },
            content: reqComment.content,
            label: reqComment.label,
            postid: id,
            likes: 0
        },
        headers: KINVEY.POSTS_HEADER
    }

    // provide url
    const url = KINVEY.URLS.postsUrl + id;

    // make request and return promise
    return jsonRequester.post(url, options)
        .then(function(res) {
            return {
                author: res.author.username,
                id: res._id
            };
        });
}

function getPostComments(id) {
    // create options
    const options = {
        headers: KINVEY.POSTS_HEADER
    }

    // create query
    let query = `?query={"postid":${id}}`;

    // provide url
    const url = KINVEY.URLS.commentsUrl + query;

    // make the request and return promise
    return jsonRequester.get(url, options)
        .then(function(res) {
            return res;
        })
}

let users = {
    register,
    signIn,
    signOut,
    currentUser
}

let posts = {
    getPosts,
    addPost,
    addCommentToPost,
    getPostComments
}

export {
    users,
    posts
};