import functions = require('firebase-functions');
import admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const subscriptionsModule = require('./subscriptions');
const registrationModule = require('./registration');

// Subscriptions
exports.mirrorSubscriptionsFollowed = functions.database.ref('/following/{follower_id}/{followed_id}').onCreate(subscriptionsModule.mirrorSubscriptionsFollowed);
exports.mirrorSubscriptionsUnfollowed = functions.database.ref('/following/{follower_id}/{followed_id}').onDelete(subscriptionsModule.mirrorSubscriptionsUnfollowed);

// Registration
exports.createEmptyUserDataInDB = functions.database.ref('/users/{user_id}').onCreate(registrationModule.createEmptyUserDataInDB);
