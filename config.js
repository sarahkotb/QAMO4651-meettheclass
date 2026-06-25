/* =============================================================
   QAMO 4651 — First-Day "Meet the Class" Survey
   THE ONLY FILE YOU NEED TO EDIT.

   1) Paste your Firebase project config below (see README.md, Step 2).
      You can reuse the SAME Firebase project as the Screen Time app —
      this app stores its data in its own collections, so they don't collide.
   2) (Optional) tweak the section labels or limits.
   ============================================================= */

window.APP_CONFIG = {

  // -------- Firebase (paste from the Firebase console) ----------
  // These are pre-filled with your existing QAMO 4651 project. If you'd rather
  // use a brand-new project, replace all six values (see README.md, Step 2).
  firebase: {
    apiKey: "AIzaSyD9hu9H7M1m7vAOaL8pqtHG8K7JHlbZeHc",
    authDomain: "qamo4651-lecture3.firebaseapp.com",
    projectId: "qamo4651-lecture3",
    storageBucket: "qamo4651-lecture3.firebasestorage.app",
    messagingSenderId: "97391190278",
    appId: "1:97391190278:web:d68eaa22b62e9097743e87"
  },

  // -------- Activity id (unique per weekly activity) ------------
  // All activities share the "responses" collection and the same rules;
  // this id is what keeps each week's data (and its live switch) separate.
  // Cloning this app for a new week? Change this one line (e.g. "lecture7").
  activity: "firstday",

  // -------- Survey settings (safe to leave as-is) ---------------
  maxCommuteHours: 12,           // reject impossible commute entries (hours)
  likertScale: [                 // 5-point agreement scale, low → high
    { value: 1, label: "Strongly disagree", face: "😟" },
    { value: 2, label: "Disagree",          face: "🙁" },
    { value: 3, label: "Neutral",           face: "😐" },
    { value: 4, label: "Agree",             face: "🙂" },
    { value: 5, label: "Strongly agree",    face: "😄" }
  ],
  likertStatement: "I feel good about this class",
  topShows: 5,                   // how many top shows to chart + show posters for

  // -------- Instructor page passcode (SHA-256 hash, NOT the passcode itself) -----
  // Current passcode: Scrite1
  // To change it, tell Claude the new passcode, or run:
  //   echo -n "YOUR PASSCODE" | shasum -a 256
  instructorPasscodeHash: "b7751d67986ca67b3984d2107797a55373b0bfe8ede2710ed986f58da7dd7294"
};
