function validateString(str, min, max, chars) {
    if (typeof str !== 'string' || str.length < min || str.length > max) {
        return {
            message: `Invalid username: Length must be between ${min} and ${max}`
        };
    }
    if (chars) {
        str = str.split('');
        if (str.some(function(char) {
                return chars.indexOf(char) < 0;
            })) {
            return {
                message: `Invalid username: Chars can be ${chars}`
            };
        }
    }
}

function validateEmail(email) {
    if (!email || email.length === 0) {
        return {
            message: 'Invalid email: Email cannot be empty'
        };
    }
    //copied from http://emailregex.com/
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(email)) {
        return {
            message: 'Invalid email: Please use name@url.ext pattern'
        };
    }
}

function validateUrl(url) {

    if (!url || url.length === 0) {
        return;
    }
    //copied from http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url#answer-5717133
    var pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    if (!pattern.test(url)) {
        return {
            message: 'Invalid url'
        };
    }
}

function validatePassword(password) {
    if (typeof password !== "string" || password.length === 0) {
        const message = "Invalid password: Password cannot be empty!";
        return {
            message
        };
    }
}

export {
    validateString,
    validateEmail,
    validateUrl,
    validatePassword
};