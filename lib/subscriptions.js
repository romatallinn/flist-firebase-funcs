"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
// Function mirrors Following and Followers lists.
// When User A starts following User B (db.following.onCreate),
// User A must be added to the Followers list of the User B.
exports.mirrorSubscriptionsFollowed = ((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    // The entity in the "Following" db --- {date, following_id}
    const original = snapshot.val();
    // Clarify user IDs
    const follower_id = context.params.follower_id; // User A that followed User B
    const followed_id = context.params.followed_id; // User B that was followed by User A
    console.log(`[FOLLOWED] Mirroring Subscriptions: User[${follower_id}] FOLLOWED User[${followed_id}], DATA: `, original);
    // Data Entry that will be set to the "Followers" db --- {date, follower_id}
    const data = {};
    data["date"] = original.date;
    try {
        // Obtain userA information --- we need only its 'username' to display it in the notification
        const follower_info = yield admin.database().ref("users/" + follower_id).once("value");
        const follower_username = follower_info.val().username;
        // Create Notification message
        const payload = {
            notification: {
                title: 'New Follower',
                body: `You were followed by ${follower_username}!`,
                sound: 'default'
            }
        };
        // Obtain userB FMC tokens --- we need them in order to send notification to all active devices
        const tokens_snap = yield admin.database().ref(`users/${followed_id}/fcm_tokens`).once("value");
        if (tokens_snap.val() !== null) {
            const tokens = Object.keys(tokens_snap.val());
            // Send FCM to all tokens
            const fcm = yield admin.messaging().sendToDevice(tokens, payload);
            // Check if any token is invalid
            const failedTokens = [];
            const successfulTokens = [];
            fcm.results.forEach((result, index) => {
                const error = result.error;
                if (error) {
                    console.warn('Failure sending notification to ', tokens[index], error);
                    // Cleanup the tokens who are not registered anymore.
                    if (error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered') {
                        failedTokens.push(tokens_snap.ref.child(tokens[index]).remove());
                    }
                }
                else {
                    successfulTokens.push(tokens[index]);
                }
            });
            console.log(`Notification was sent to ${successfulTokens.length} tokens : `, successfulTokens);
        }
        else {
            console.warn(`User[${followed_id}] does not have any FCM tokens!`);
        }
        // Finally, we add mirror entity to the "Followers" db
        return admin.database().ref(`/followers/${followed_id}/${follower_id}`).set(data);
    }
    catch (err) {
        console.error("ERROR CAUGHT: ", err);
    }
}));
exports.mirrorSubscriptionsUnfollowed = ((snapshot, context) => {
    // Clarify user IDs
    const follower_id = context.params.follower_id; // User A that unfollowed User B
    const followed_id = context.params.followed_id; // User B that was unfollowed by User A
    const original = snapshot.val();
    console.log(`[UNFOLLOWED] Mirroring Subscriptions. User[ ${context.params.user_id} UNFOLLOWED User[${followed_id}], DATA: `, original);
    return admin.database().ref(`/followers/${followed_id}/${follower_id}`).remove();
});
//# sourceMappingURL=subscriptions.js.map