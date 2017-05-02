import * as templates from "template-requester";
import * as data from "data";
import User from "userModel";
import { USERNAME_LOCAL_STORAGE } from "constants";

const $content = $("#content");

// http://codeseven.github.io/toastr/demo.html
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "50",
    "hideDuration": "50",
    "timeOut": "1200",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "slideDown",
    "hideMethod": "slideUp"
}

var sammyApp = Sammy('#content', function() {
    this.get('/', context => context.redirect('#/home'));

    this.get('#/', context => context.redirect('#/home'));

    this.get('#/home', context => loader.loadHomePage(context));

    this.get('#/home/:category', context => loader.loadHomePage(context, this.params["category"]));

    this.get('#/login', context => loader.loadLoginMenu(context));

    this.get('#/register', context => loader.loadRegisterMenu(context));

    this.get('#/posts/add', context => loader.loadCreatePost(context));

    this.get('#/posts/:postid', context => loader.loadCurrentPost(context, this.params["postid"]));

    this.get('#/posts/:postid/comment', context => loader.loadCreateComment(context, this.params["postid"]));
});

let loader = {
    loadHomePage: function(context, category) {
        data.posts.getPosts(category)
            .then(info => templates.get("home")
                .then(template => {
                    $content
                        .find("#main-content")
                        .html(template({ info }));

                    $("#all-posts-sortable").sortable();

                    // TODO: separate logic on different file
                    let signedUser = localStorage.getItem(USERNAME_LOCAL_STORAGE);
                    if (!signedUser) {
                        $("#login-button").show();
                        $("#logout-button").hide();
                        $("#login-info").hide();
                    } else {
                        $("#logout-button").show();
                        $("#login-info").show();
                        $("#login-button").hide();
                    }

                    // click login -> goes to login page
                    $("body").on("click", "#login-button", () => {
                        context.redirect("#/login");
                    });

                    // click logout -> logouts and goes to home page
                    $("body").on("click", "#logout-button", () => {
                        console.log(data);
                        data.users.signOut()
                            .then(() => {
                                toastr.success("User " + signedUser + " signed out!", "Success!");
                                context.redirect("#/home");
                                $("#logout-button").fadeOut(100, function() {
                                    $("#login-button")
                                        .fadeIn(400);
                                    $("#login-info").hide();
                                });
                            })
                            .catch(err => {
                                toastr.error(err, "Error!");
                            })
                    });
                }))
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
                            toastr.success("User " + user.username + " signed in!", "Success!");
                            $("#login-button").fadeOut(100, function() {
                                $("#logout-button")
                                    .fadeIn(400);
                                $("#login-info")
                                    .fadeIn(400)
                                    .html("Hello, " + user.username);
                            })
                        })
                        .then(() => {
                            context.redirect("#/home");
                        })
                        .catch(err => {
                            if (typeof err === "object") {
                                err = err.responseText;
                            }
                            toastr.error(err, "Error!");
                        })
                });
            })
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
                        })
                });
            })
    },
    loadCreatePost: function(context) {

    },
    loadCurrentPost: function(context, postid) {

    },
    loadCreateComment: function(context, postid) {

    }
}

sammyApp.run('#/');