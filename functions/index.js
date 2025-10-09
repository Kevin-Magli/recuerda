const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.makeAdmin = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  // Ensure the user calling the function is an admin.
  // This is crucial for security.
  if (context.auth.token.isAdmin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can add other admins."
    );
  }

  const email = data.email;
  try {
    // 2. Get User
    // Find the user account corresponding to the provided email.
    const user = await admin.auth().getUserByEmail(email);

    // 3. Set Custom Claim
    // Set the isAdmin custom claim on that user's account.
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
    
    // 4. Update Firestore for Redundancy (Optional but good practice)
    // This makes it easy to query for all admins later if needed.
    // Note: The original request to check the 'roles_admin' collection is now
    // superseded by this Custom Claim logic, but writing here creates consistency.
    await admin.firestore().collection("roles_admin").doc(user.uid).set({
        isAdmin: true
    });

    return { message: `Success! ${email} has been made an admin.` };
  } catch (error) {
    console.error("Error in makeAdmin function:", error);
    if (error.code === "auth/user-not-found") {
       throw new functions.https.HttpsError(
         "not-found",
         `User with email ${email} was not found.`
       );
    }
    // For other errors, return a generic internal error.
    throw new functions.https.HttpsError(
      "internal",
      "An internal error occurred."
    );
  }
});
