/* =============================================================
   QAMO 4651 — shared live-survey core (one per project, never edited)

   Every weekly activity uses this same data layer:
     • one Firestore collection  "responses"  for ALL activities
     • one control doc per activity  control/<activityId>  (the live on/off switch)
     • anonymous sign-in so each device owns (and can edit) one response per activity

   A new activity = a new `activity` id + its own questions/visuals.
   Nothing here, and nothing in firestore.rules, has to change.
   ============================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, query, where, onSnapshot, collection }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const RESPONSES = "responses";
const respId = (activity, uid) => `${activity}__${uid}`;   // one doc per (activity, device)

// Initialize Firebase once. Returns { app, db, auth }.
export function initFirebase(cfg){
  const app = initializeApp(cfg.firebase);
  return { app, db: getFirestore(app), auth: getAuth(app) };
}

// ---- student side ----

// Anonymous sign-in; resolves with this device's stable uid.
export function signInDevice(auth){
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, u => { if (u) resolve(u.uid); });
    signInAnonymously(auth).catch(reject);
  });
}

// Watch the instructor's open/close switch for this activity.
export function watchControl(db, activity, cb, onErr){
  return onSnapshot(doc(db, "control", activity),
    s => cb(s.exists() ? s.data() : { open:false }),
    e => onErr ? onErr(e) : cb({ open:false }));
}

// Load this device's existing response for the activity (or null).
export async function loadMyResponse(db, activity, uid){
  try { const s = await getDoc(doc(db, RESPONSES, respId(activity, uid)));
    return s.exists() ? s.data() : null; }
  catch(e){ return null; }
}

// Create or edit this device's response. `answers` is an activity-specific map.
export function saveMyResponse(db, { activity, uid, section, day, answers }){
  return setDoc(doc(db, RESPONSES, respId(activity, uid)),
    { activity, uid, section, day, answers, updatedAt: serverTimestamp() });
}

// ---- instructor side ----

// Flip the live form on/off for an activity.
export function setControl(db, activity, { open, section, day }){
  return setDoc(doc(db, "control", activity), { activity, open, section, day });
}

// Stream every response for an activity. cb gets an array of
// { uid, section, day, answers, time }. Filter by section/day in the page.
export function watchResponses(db, activity, cb, onErr){
  const q = query(collection(db, RESPONSES), where("activity", "==", activity));
  return onSnapshot(q, snap => {
    const recs = [];
    snap.forEach(d => { const x = d.data();
      recs.push({ uid:x.uid, section:x.section, day:x.day, answers:x.answers || {},
        time: x.updatedAt?.toDate ? x.updatedAt.toDate() : null }); });
    cb(recs);
  }, e => onErr && onErr(e));
}
