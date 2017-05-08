import { sammyApp, loader } from "router";
import * as data from "data";

(function() {
    // configure toastr
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
    };

    // start router
    sammyApp.run('https://rawgit.com/mango-telerik/talk-in-code-app/master/index.html#/');

    // click login -> goes to login page
    $("body").on("click", "#login-button", () => {
        window.location.href = "#/login";
    });

    // click logout -> logouts and goes to home page
    $("body").on("click", "#logout-button", () => {
        // console.log(data);
        data.users.signOut()
            .then((user) => {
                toastr.success("User " + user + " signed out!", "Success!");
                window.location.href = "#/";
                $("#logout-button").fadeOut(100, function() {
                    $("#login-button")
                        .fadeIn(400);
                    $("#login-info").hide();
                });
            })
            .catch(err => {
                toastr.error(err, "Error!");
            });
    });

    // add likes
    $("body").on("click", ".add-post-like", (ev) => {
        let postId = $(ev.target).attr("id");
        console.log(postId);
        data.posts.addPostLike(postId)
            .then(() => {
                let $likeContainer = $("#" + postId + ">span");
                let likes = +$likeContainer.html() + 1;
                $likeContainer.html(likes);
                toastr.success("You liked the post! Thank you!", "Success!");
            });
    });

    $("body").on("click", ".add-comment-like", (ev) => {
        let commentId = $(ev.target).attr("id");
        console.log(commentId);
        data.comments.addCommentLike(commentId)
            .then(() => {
                let $likeContainer = $("#" + commentId + ">span");
                let likes = +$likeContainer.html() + 1;
                $likeContainer.html(likes);
                toastr.success("You liked the comment! Thank you!", "Success!");
            });
    });
})();