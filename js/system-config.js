System.config({
    transpiler: "plugin-babel",
    map: {
        "plugin-babel": "../node_modules/systemjs-plugin-babel/plugin-babel.js",
        "systemjs-babel-build": "../node_modules/systemjs-plugin-babel/systemjs-babel-browser.js",

        // bower modules
        //"jquery": "../bower_components/jquery/dist/jquery.min.js",
        //"sammy": "../bower_components/sammy/lib/sammy.js",
        //"toastr": "../bower_components/toastr/toastr.min.js",
        //"jquery-ui": "../bower_components/jquery-ui/jquery-ui.min.js",
        //"handlebars": "../bower_components/handlebars/handlebars.min.js",
        //"moment": "../bower_components/moment/moment.js",
        //"crypto": "../bower_components/crypto-js/crypto-js.js",

        // local modules
        "main": "./js/main.js",
        "validator": "./js/helpers/validator.js",
        "constants": "./js/helpers/constants.js",
        "data": "./js/data.js",
        "requester": "./js/requesters/json-requester.js",
        "template-requester": "./js/requesters/template-requester.js",
        "event-handler": "./js/renderer/event-handler.js",
        "userModel": "./js/models/user.js",
        "elementModel": "./js/models/element.js",
        "categoryModel": "./js/models/category.js",
        "postModel": "./js/models/post.js",
        "commentModel": "./js/models/comment.js",
        "kinvey": "./js/helpers/kinvey.js",
        "router": "./js/routing.js",
        "tinymce-init": "./js/helpers/tinymceInit.js"
    }
});