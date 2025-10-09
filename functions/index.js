
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.makeAdmin = functions.https.onCall(async (data, context) => {
  // 1. Check if the user calling the function is already an admin.
  if (context.auth.token.isAdmin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only administrators can make other users admins."
    );
  }

  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with one argument 'email'."
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
    return {
      message: `Success! ${email} has been made an admin.`,
    };
  } catch (error) {
    console.error("Error setting custom claims:", error);
     if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        "not-found",
        `User with email ${email} not found.`
      );
    }
    throw new functions.https.HttpsError(
      "internal",
      "An unexpected error occurred."
    );
  }
});
