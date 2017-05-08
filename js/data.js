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
    ID_LOCAL_STORAGE,
    CURRENT_POST
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
    };

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
            console.log(res);
            // localStorage.setItem(USERNAME_LOCAL_STORAGE, res.username);
            // localStorage.setItem(AUTH_KEY_LOCAL_STORAGE, res._kmd.authtoken);
            // localStorage.setItem(ID_LOCAL_STORAGE, res._id);
            return res;
        });
}

function signOut() {
    // remove user data from local storage
    var promise = new Promise(function(resolve, reject) {
        let username = localStorage.getItem(USERNAME_LOCAL_STORAGE);
        localStorage.removeItem(USERNAME_LOCAL_STORAGE);
        localStorage.removeItem(AUTH_KEY_LOCAL_STORAGE);
        localStorage.removeItem(ID_LOCAL_STORAGE);
        resolve(username);
    });
    return promise;
}

function currentUser() {
    // check if user is logged in
    return !!localStorage.getItem(USERNAME_LOCAL_STORAGE) &&
        !!localStorage.getItem(AUTH_KEY_LOCAL_STORAGE);
}

function authUser() {
    return localStorage.getItem(USERNAME_LOCAL_STORAGE);
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
    };

    // provide url
    const url = KINVEY.URLS.postsUrl;

    // make request and return promise
    return jsonRequester.post(url, options)
        .then(function(res) {
            return {
                title: res.title,
                author: res.author.username,
                id: res._id,
                createdate: res._kmd.ect
            };
        });
}

function getPosts(category, author) {
    // create options
    const options = {
        headers: KINVEY.POSTS_HEADER
    };

    // create query based on what is provided (category, author)
    let query = "";
    if (category) {
        query = `?query={"category":"${category}"}`;
    }

    if (author) {
        query = `?query={"author.username":"${author}"}`;
    }

    // provide url
    const url = KINVEY.URLS.postsUrl + query;

    // make the request and return promise
    return jsonRequester.get(url, options)
        .then(function(res) {
            // if (localStorage.CURRENT_POST) {
            //     localStorage.removeItem(CURRENT_POST);
            // }

            // for (let i = 0; i < res.length; i += 1) {
            //     var createdate = new Date(res[i]._kmd.ect);
            //     res[i]._kmd.ect = moment(createdate).format('YYYY-MM-DD HH:mm');
            // }
            return res;
        });
}

/* Comments */
function addCommentToPost(reqComment, id) {
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
    };

    // provide url
    const url = KINVEY.URLS.commentsUrl;

    // make request and return promise
    return jsonRequester.post(url, options)
        .then(function(res) {
            return {
                author: res.author.username,
                id: res._id
            };
        });
}

function editCommentToPost(reqComment, id, postid) {
    // if created comment has errors
    const message = reqComment.errors;
    if (message) {
        return Promise.reject(message.join("<br/>"));
    }

    // create options
    const options = {
        data: {
            author: reqComment.author,
            content: reqComment.content,
            label: reqComment.label,
            postid: postid,
            likes: reqComment.likes
        },
        headers: KINVEY.POSTS_HEADER
    };

    // provide url
    const url = KINVEY.URLS.commentsUrl + id;

    // make request and return promise
    return jsonRequester.put(url, options)
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
    };

    // create query
    let query = `?query={"postid":"${id}"}`;

    // provide url
    const url = KINVEY.URLS.commentsUrl + query;

    // make the request and return promise
    return jsonRequester.get(url, options)
        .then(function(res, options) {

            for (let i = 0; i < res.length; i += 1) {
                var createdate = new Date(res[i]._kmd.ect);
                res[i]._kmd.ect = moment(createdate).format('YYYY-MM-DD HH:mm');
            }
            return res;
        });
}

function getSinglePost(id) {
    const options = {
        headers: KINVEY.POSTS_HEADER
    };

    // if category provided create query
    let query = `?query={"_id":"${id}"}`;

    // provide url
    const url = KINVEY.URLS.postsUrl + query;

    // make the request and return promise
    return jsonRequester.get(url, options)
        .then(function(res, options) {

            for (let i = 0; i < res.length; i += 1) {
                var createdate = new Date(res[i]._kmd.ect);
                res[i]._kmd.ect = moment(createdate).format('YYYY-MM-DD HH:mm');
            }
            return res;

        });
}

function getComment(id) {
    const options = {
        headers: KINVEY.POSTS_HEADER
    };

    // if category provided create query
    let query = `?query={"_id":"${id}"}`;

    // provide url
    const url = KINVEY.URLS.commentsUrl + query;

    // make the request and return promise
    return jsonRequester.get(url, options)
        .then(function(res) {
            return res;
        });
}

function editPost(reqPost, id) {
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
            likes: reqPost.likes
        },
        headers: KINVEY.POSTS_HEADER
    };

    // provide url
    const url = KINVEY.URLS.postsUrl + id;

    // make request and return promise
    return jsonRequester.put(url, options)
        .then(function(res) {
            return {
                title: res.title,
                author: res.author.username,
                id: res._id
            };
        });

}

function deletePost(id) {
    const options = {
        headers: KINVEY.USERS_HEADER_DELETE
    };

    let postQuery = `?query={"_id":"${id}"}`;
    const postUrl = KINVEY.URLS.postsUrl + postQuery;

    let commQuery = `?query={"postid":"${id}"}`;
    const commUrl = KINVEY.URLS.commentsUrl + commQuery;

    return jsonRequester.del(postUrl, options)
        .then(jsonRequester.del(commUrl, options))
        .then(function(res) {
            return res;
        });
}

function deleteComment(id) {
    const options = {
        headers: KINVEY.USERS_HEADER_DELETE
    };
    let query = `?query={"_id":"${id}"}`;
    const url = KINVEY.URLS.commentsUrl + query;
    return jsonRequester.del(url, options)
        .then(function(res) {
            return res;
        });
}

function addPostLike(id) {
    return getSinglePost(id)
        .then(posts => {
            let reqPost = posts[0];
            // create options
            const options = {
                data: {
                    title: reqPost.title,
                    author: reqPost.author,
                    content: reqPost.content,
                    category: reqPost.category,
                    likes: (+reqPost.likes + 1)
                },
                headers: KINVEY.POSTS_HEADER
            };

            // provide url
            const url = KINVEY.URLS.postsUrl + id;

            // make request and return promise
            return jsonRequester.put(url, options)
                .then(function(res) {
                    return res;
                });
        });
}

function addCommentLike(id) {
    return getComment(id)
        .then(comments => {
            let reqComment = comments[0];
            // create options
            const options = {
                data: {
                    author: reqComment.author,
                    content: reqComment.content,
                    label: reqComment.label,
                    postid: reqComment.postid,
                    likes: (+reqComment.likes + 1)
                },
                headers: KINVEY.POSTS_HEADER
            };

            // provide url
            const url = KINVEY.URLS.commentsUrl + id;

            // make request and return promise
            return jsonRequester.put(url, options)
                .then(function(res) {
                    return res;
                });
        });
}

let users = {
    register,
    signIn,
    signOut,
    currentUser,
    authUser
};

let posts = {
    getPosts,
    addPost,
    getSinglePost,
    editPost,
    deletePost,
    addPostLike
};

let comments = {
    addCommentToPost,
    getPostComments,
    getComment,
    editCommentToPost,
    deleteComment,
    addCommentLike
};

export {
    users,
    posts,
    comments
};