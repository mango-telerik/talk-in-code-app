import * as templates from "template-requester";
import * as data from "data";
import User from "userModel";
import Post from "postModel";
import { tinyInit } from "tinymce-init";
import Comment from "commentModel";
import {
    USERNAME_LOCAL_STORAGE,
    AUTH_KEY_LOCAL_STORAGE,
    ID_LOCAL_STORAGE,
    CURRENT_POST
} from "constants";

const $content = $("#content");

var sammyApp = Sammy('#content', function() {
    this.get('/', context => context.redirect('#/home'));

    this.get('#/', context => context.redirect('#/home'));

    this.get('#/home', context => loader.loadHomePage(context, false, false, false));

    this.get('#/home/:category', function(context) { loader.loadHomePage(context, this.params["category"], false, false); });

    this.get('#/home/all/:author', function(context) { loader.loadHomePage(context, false, this.params["author"], false); });

    this.get('#/login', context => loader.loadLoginMenu(context));

    this.get('#/register', context => loader.loadRegisterMenu(context));

    this.get('#/posts/add', context => loader.loadCreatePost(context));

    this.get('#/posts/:postid', function(context) { loader.loadCurrentPost(context, this.params["postid"]); });

    this.get('#/posts/:postid/comment', function(context) { loader.loadCreateComment(context, this.params["postid"]); });

    this.get('#/posts/:postid/edit', function(context) { loader.loadEditPost(context, this.params["postid"]); });

    this.get('#/comments/:commentid/edit', function(context) { loader.loadEditComment(context, this.params["commentid"]); });

    this.get('#/page/:pageid', function(context) { loader.loadHomePage(context, false, false, this.params["pageid"]); });

    this.get('#/posts/:postid/delete', function(context) { loader.deletePost(context, this.params["postid"]); });

    this.get('#/comments/:postid/:commentid/delete', function(context) { loader.deleteComment(context, this.params["postid"], this.params["commentid"]); });

    this.get('#/contacts', context => loader.loadContacts(context));

});

let loader = {
    loadHomePage: function(context, category, author) {

        data.posts.getPosts(category, author)
            .then(info => {
                if (localStorage.CURRENT_POST) {
                    localStorage.removeItem(CURRENT_POST);
                }

                for (let i = 0; i < info.length; i += 1) {
                    var createdate = new Date(info[i]._kmd.ect);
                    info[i]._kmd.ect = moment(createdate).format('YYYY-MM-DD HH:mm');
                }

                info = info.sort(function(a, b) {
                    let aTime = new Date(a._kmd.ect),
                        bTime = new Date(b._kmd.ect);
                    if (aTime < bTime) {
                        return 1;
                    } else if (aTime > bTime) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                templates.get("home")

                .then(template => {
                        let allPosts = { info };
                        if (category) {
                            allPosts.currentCategory = "/ " + category;
                        }
                        $content
                            .find("#main-content")
                            .html(template(allPosts));
                        $(window).scrollTop(0);
                    })
                    .then(() => {
                        // TODO: separate logic on different file
                        // $("#all-posts-sortable").sortable();
                        let signedUser = localStorage.getItem(USERNAME_LOCAL_STORAGE);
                        if (!signedUser) {
                            $("#login-button").show();
                            $("#add-new-thread").hide();
                            $("#logout-button").hide();
                            $("#login-info").hide();
                        } else {
                            $("#logout-button").show();
                            $("#login-info").show();
                            $("#add-new-thread").show();
                            $("#login-button").hide();
                        }
                    });
            });
    },
    loadLoginMenu: function(context) {
        templates.get("login")
            .then(function(template) {
                $content
                    .find("#main-content")
                    .html(template());

                // TODO: separate logic on different file
                $("body").on("click", "#btn-sign-in", () => {
                    var user = {
                        username: $("#tb-username").val(),
                        password: $("#tb-password").val()
                    };

                    data.users.signIn(user)
                        .then(user => {
                            console.log(user);
                            localStorage.setItem(USERNAME_LOCAL_STORAGE, user.username);
                            localStorage.setItem(AUTH_KEY_LOCAL_STORAGE, user._kmd.authtoken);
                            localStorage.setItem(ID_LOCAL_STORAGE, user._id);
                            toastr.success("User " + user.username + " signed in!", "Success!");
                            $("#login-button").fadeOut(100, function() {
                                $("#logout-button")
                                    .fadeIn(400);
                                $("#login-info")
                                    .fadeIn(400)
                                    .html("Hello, " + user.username);
                            });
                        })
                        .then(() => {
                            context.redirect("#/home");
                        })
                        .catch(err => {
                            if (typeof err === "object") {
                                err = err.responseText;
                            }
                            toastr.error(err, "Error!");
                        });
                });
            });
    },
    loadRegisterMenu: function(context) {
        templates.get("register")
            .then(function(template) {
                $content
                    .find("#main-content")
                    .html(template());

                // TODO: separate logic on different file
                $("body").on("click", "#btn-register", function() {
                    // read from input fields
                    const username = $("#tb-reg-username").val(),
                        password = $("#tb-reg-password").val(),
                        email = $("#tb-reg-email").val();
                    // create user
                    const user = new User(username, password, email);

                    data.users.register(user)
                        .then(user => {
                            toastr.success("User " + user.username + " registered!", "Success!");
                            context.redirect("#/login");
                        })
                        .catch(err => {
                            if (typeof err === "object") {
                                err = err.responseText;
                            }
                            toastr.error(err, "Error!");
                        });
                });
            });
    },
    loadCreatePost: function(context) {
        let user = localStorage.getItem(USERNAME_LOCAL_STORAGE);
        templates.get("create-post")
            .then(template => {
                context
                    .$element()
                    .find("#main-content")
                    .html(template({ user }));
                return context;
            })
            .then(() => {
                $(() => {
                    tinyInit();
                });
            });

        $("body").on("click", "#create-new-post-request-button", function(ev) {
            var title, category;
            var content = "New pst";
            const author = { "username": data.users.authUser() };
            const likes = 0;
            $("#tb-thread-title")
                .keyup(function() {
                    title = $(this).val();
                })
                .keyup();
            category = $("#tb-thread-category").val();
            content = tinymce.get("post-content-field").getContent();
            console.log(content);
            const newPost = new Post(author, content, likes, title, category);
            console.log(newPost);
            data.posts.addPost(newPost)
                .then(function() {
                    toastr.success("You have published new post!");
                    setTimeout(function() {
                        context.redirect("#/");
                        document.location.reload(true);
                    }, 1000);
                }, function(err) {
                    if (typeof err === "object") {
                        err = err.responseText;
                    }
                    toastr.error(err);
                });
        });
    },
    loadCurrentPost: function(context, postid) {
        data.posts.getSinglePost(postid)
            .then(posts => {
                let currentPost = posts[0];
                localStorage.setItem(CURRENT_POST, JSON.stringify(currentPost));
                let currentPostId = currentPost._id;
                data.comments.getPostComments(currentPostId)
                    .then(comments => {
                        comments = comments.sort(function(a, b) {
                            let aTime = new Date(a._kmd.ect),
                                bTime = new Date(b._kmd.ect);
                            if (aTime < bTime) {
                                return -1;
                            } else if (aTime > bTime) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        currentPost.comments = comments;
                        return currentPost;
                    })
                    .then(postWithComments => templates.get("current-post")
                        .then(template => {
                            $content
                                .find("#main-content")
                                .html(template(postWithComments));
                            $(window).scrollTop(0);
                        })
                        .then(() => {
                            $(".add-new-comment").hide();
                            $(".edit-post").hide();
                            $(".edit-comment").hide();
                            $(".delete-post").hide();
                            $(".delete-comment").hide();
                            let signedUser = localStorage.getItem(USERNAME_LOCAL_STORAGE);
                            if (signedUser) {
                                $(".add-new-comment").show();
                                $("#edit-post-" + signedUser).show();
                                $(".edit-comment-" + signedUser).show();
                                $("#delete-post-" + signedUser).show();
                                $(".delete-comment-" + signedUser).show();
                            }

                        })
                    );
            });
    },
    loadCreateComment: function(context, postid) {
        const currentPost = JSON.parse(localStorage.getItem(CURRENT_POST));
        let author = localStorage.getItem(USERNAME_LOCAL_STORAGE);
        templates.get("create-comment")
            .then(template => {
                $content
                    .find("#main-content")
                    .html(template({ category: currentPost.category, id: postid }));
            })
            .then(() => {
                $(document).ready(function() {
                    tinyInit();
                });
            });

        $("body").on("click", "#add-comment-request-button", function(ev) {
            let label = $("#tb-comment-label").val();
            let content = tinymce.get("post-content-field").getContent();
            const comment = new Comment({ username: author }, content, 0, label);
            data.comments.addCommentToPost(comment, postid)
                .then(function() {
                    toastr.success("You have created a new comment!", "Success!");
                    setTimeout(function() {
                        context.redirect("#/posts/" + postid);
                        document.location.reload(true);
                    }, 1000);
                }, function(err) {
                    if (typeof err === "object") {
                        err = err.responseText;
                    }
                    toastr.error(err);
                });
        });
    },
    loadEditPost: function(context, postid) {
        const currentPost = JSON.parse(localStorage.getItem(CURRENT_POST));
        templates.get("edit-post")
            .then(template => {
                $content
                    .find("#main-content")
                    .html(template(currentPost));
            })
            .then(() => {
                $(document).ready(function() {
                    tinyInit();
                });
            });

        $("body").on("click", "#edit-post-request-button", function(ev) {
            let category = currentPost.category;
            let author = currentPost.author;
            let likes = currentPost.likes;
            let title = currentPost.title;
            category = $("#tb-thread-category").val();
            $("#tb-thread-title")
                .keyup(function() {
                    title = $(this).val();
                })
                .keyup();
            let content = tinymce.get("post-content-field").getContent();
            const editedPost = new Post(author, content, likes, title, category);
            data.posts.editPost(editedPost, postid)
                .then(function() {
                    toastr.success("You have edited your post!", "Success!");
                    setTimeout(function() {
                        context.redirect("#/posts/" + postid);
                        document.location.reload(true);
                    }, 1000);
                }, function(err) {
                    if (typeof err === "object") {
                        err = err.responseText;
                    }
                    toastr.error(err);
                });
        });
    },
    loadEditComment: function(context, commentid) {
        data.comments.getComment(commentid)
            .then(currentComments => {
                console.log(currentComments);
                templates.get("edit-comment")
                    .then(template => {
                        $content
                            .find("#main-content")
                            .html(template(currentComments[0]));
                    })
                    .then(() => {
                        $(document).ready(function() {
                            tinyInit();
                        });
                    });

                $("body").on("click", "#edit-comment-request-button", function(ev) {
                    let currentComment = currentComments[0];
                    let author = currentComment.author;
                    let likes = currentComment.likes;
                    let label = $("#tb-comment-label").val();
                    let content = tinymce.get("post-content-field").getContent();
                    const comment = new Comment(author, content, 0, label);

                    data.comments.editCommentToPost(comment, commentid, currentComment.postid)
                        .then(function() {
                            toastr.success("You have edited your comment!", "Success!");
                            setTimeout(function() {
                                context.redirect("#/posts/" + currentComment.postid);
                                //document.location.reload(true);
                            }, 1000);
                        }, function(err) {
                            if (typeof err === "object") {
                                err = err.responseText;
                            }
                            toastr.error(err);
                        });
                });
            });
    },
    deletePost: function(context, id) {
        data.posts.deletePost(id)
            .then(() => {
                $("#myPostsModal").modal('hide');
                toastr.success("Your post was deleted!", "Success!");
                setTimeout(function() {
                    context.redirect("#/");
                    //document.location.reload(true);
                }, 1000);
            })
            .catch(err => {
                if (typeof err === "object") {
                    err = err.responseText;
                }
                toastr.error(err, "Error!");
            });
    },
    deleteComment: function(context, postid, id) {
        data.comments.deleteComment(id)
            .then(() => {
                $("#myCommentsModal-" + id).modal('hide');
                toastr.success("Your comment was deleted!", "Success!");
                setTimeout(function() {
                    context.redirect("#/posts/" + postid);
                    //document.location.reload(true);
                }, 1000);
            })
            .catch(err => {
                if (typeof err === "object") {
                    err = err.responseText;
                }
                toastr.error(err, "Error!");
            });
    },
    loadContacts(context) {
        templates.get("contacts")
            .then(template => {
                context
                    .$element()
                    .find("#main-content")
                    .html(template());
            })
            .then(() => {
                $("body").on("click", ".submit-cintact", function(ev) {
                    toastr.success("Thank you for sending us your message!", "Success!");
                    setTimeout(function() {
                        context.redirect("#/");
                    }, 1000);
                });
            });
    }
};

export { sammyApp, loader };