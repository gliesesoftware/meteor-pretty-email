/*global OriginalHandlebars, Meteor, Handlebars, Accounts, _ */
/* pretty emails logic */

// exported global, contains defaults and an options field
PrettyEmail = {
    options: {},
    defaults: {
        verifyEmail: {
            heading: 'Just one more step...',
            message: 'Click on the big button below to activate your account',
            buttonText: 'Activate account'
        },
        resetPassword: {
            heading: 'Reset your password',
            message: 'Click the big button below to reset your password',
            buttonText: 'Reset password'
        },
        enrollAccount: {
            heading: 'To start using service, simply click the button below',
            buttonText: 'Change password'
        }
    },
    style: {
        fontFamily: 'Helvetica',
        fontColor: '#606060',
        buttonColor: '#FFFFFF',
        buttonBgColor: '#3071a9'
    },
    send: function (template, options) {
        return Email.send({
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: this.render(template, options)
        });
    },
    render: function (template, options) {
        options.style = this.style;
        options = _.extend(this.options, options);
        return Handlebars.templates[template](options);
    }
};

/* Override Accounts.urls to remove hashbang from urls */

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
};


/* Customise meteor email templates */

Accounts.emailTemplates.verifyEmail.subject = function () {
    return 'Activate your account';
};

Accounts.emailTemplates.verifyEmail.html = function (user, verifyEmailUrl) {
    var options;
    options = _.extend({}, PrettyEmail.defaults.verifyEmail, {
        subject: Accounts.emailTemplates.verifyEmail.subject(user),
        buttonUrl: verifyEmailUrl
    });
    return PrettyEmail.render('call-to-action', options);
};

Accounts.emailTemplates.resetPassword.subject = function () {
    return 'Reset your password';
};

Accounts.emailTemplates.resetPassword.html = function (user, resetPasswordUrl) {
    var options;
    options = _.extend({}, PrettyEmail.defaults.resetPassword, {
        subject: Accounts.emailTemplates.resetPassword.subject(user),
        buttonUrl: resetPasswordUrl
    });
    return PrettyEmail.render('call-to-action', options);
};

Accounts.emailTemplates.enrollAccount.subject = function () {
    return 'An account has been created for you';
};

Accounts.emailTemplates.enrollAccount.html = function (user, enrollAccountUrl) {
    var options;
    options = _.extend({}, PrettyEmail.defaults.enrollAccount, {
        subject: Accounts.emailTemplates.enrollAccount.subject(user),
        buttonUrl: enrollAccountUrl
    });
    return PrettyEmail.render('call-to-action', options);
};

Meteor.startup(function () {
    if (PrettyEmail.options.from) {
        return Accounts.emailTemplates.from = PrettyEmail.options.from;
    }
});

// register footer helper which adds PrettyEmail options to to context
OriginalHandlebars.registerHelper('footer', function () {
    var options;
    options = _.extend(this, PrettyEmail.options);
    if (options.companyName) {
        return Handlebars.templates.footer(options);
    }
});