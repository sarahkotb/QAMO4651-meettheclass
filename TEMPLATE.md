# Cloning this app for a new weekly activity

The whole semester's activities share **one Firebase project, one `responses`
collection, and one rules file** (already published). A new activity is just a new
web page with a new `activity` id — **no Firebase or rules changes, ever.**

## The shared, never-edited pieces
- `core.js` — Firebase + anonymous sign-in + the live on/off switch + read/write of
  `responses`. Copy as-is into every activity.
- `firestore.rules` — generic; published once for the project. Don't touch it again.
- `styles.css` — the shared look. Copy as-is (extend if an activity needs new styles).
- `config.js` — same Firebase block every week; only the `activity` id (and that
  week's settings) change.

## Make a new activity in 4 steps
1. **Copy the folder** (e.g. `first-day-survey` → `lecture7-regression`).
2. **Change one line in `config.js`:** `activity: "lecture7"` (any short unique id).
   This alone keeps the new activity's data and live-switch separate from every
   other week. Update any activity-specific settings too (e.g. the Likert statement).
3. **Edit the questions** in `index.html` — change the form fields, then build the
   `answers` object in the submit handler to match. The data layer doesn't care what
   keys you put in `answers`:
   ```js
   const answers = { /* whatever this week asks, e.g. */ x: 3, choice: "A" };
   await Core.saveMyResponse(db, { activity: ACT, uid, section: session.section, day: session.day, answers });
   ```
4. **Edit the visuals** in `instructor.html` — read the fields back from `r.answers`
   in `subscribe()` and draw whatever charts this activity needs. The control
   buttons, passcode gate, QR code, section switch, test-data button, and PDF export
   are all reusable plumbing — keep them.

## What stays identical every week (free plumbing)
- Passcode gate (`Scrite4`), Section 1/2 selector, **Open / Close submissions**,
  the *"This is not live at the moment."* student message.
- One anonymous, editable response per device.
- QR code + student link, **Load test data** rehearsal button, **Download PDF report**.

## Publish
Upload the new folder to its own GitHub Pages path (or a new repo). Because Firebase
is already set up for the project, the new page is live as soon as Pages builds —
just **Open** it from its instructor page in class.

> Reusing one project across ~17 activities is the deliberate design: the `activity`
> id namespaces each week's data, and the generic rules mean you set up Firebase
> **once** for the entire course. See README.md for the one-time project setup.
