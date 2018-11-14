import admin = require('firebase-admin');
//
exports.createEmptyUserDataInDB = (async (snapshot, context) => {

  // The entity in the "Following" db --- {date, following_id}
  const original = snapshot.val();

  // Clarify user ID
  const user_id = context.params.user_id; // User A that followed User B

  console.log(`[REGISTERED] Creating a user profile in Database for User[${ user_id }].`);


  try {

    // Obtain user's data snap in order to figure out if it's already been initialized
    // (because older versions of the IOS app initialize internally)
    // This block will be removed in the future
    const user_db_snap = await admin.database().ref(`users/${ user_id }/date`).once("value");

    if (user_db_snap.val() !== null) {
      console.log(`The profile has already been initialized for User[${ user_id }].`);
      return;
    }

  } catch (err) {
    console.error("ERROR CAUGHT: ", err);
  }

  // Initialize date elements
  const today = new Date();
  const dd = today.getDate().toString();
  const mm = (today.getMonth()+1).toString(); //January is 0!
  const yyyy = today.getFullYear().toString();

  // Initialize data entry
  const data : {[key: string] : any;} = {};
  data["username_lowercased"] = original.username.toLowerCase();
  data["date"] = `${ dd }/${ mm }/${ yyyy }`;
  data["verified"] = false;

  // Upload data to DB
  return admin.database().ref(`/users/${ user_id }`).update(data);

});
