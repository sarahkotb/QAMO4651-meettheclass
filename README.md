# Meet the Class — QAMO 4651 (First Day)

A live, in-class icebreaker. Students scan a QR code and answer four quick,
**anonymous** questions; the instructor dashboard turns the answers into a world
map, a U.S. state map, a favorite-shows chart (with posters), and probability
charts for commute time and the "I feel good about this class" agreement scale —
then exports a clean PDF for your slides.

Two pages:

| Page | Who | What |
|---|---|---|
| `index.html` | Students (phones, via QR) | One short form: country, state, favorite show, commute, agreement |
| `instructor.html` | You (projector) | The live dashboard + PDF export |

It's built exactly like the Screen Time app, so the setup will feel familiar.
The one new step is enabling **Anonymous sign-in** (Step 1c) — that's what lets a
student edit *their own* answer but nobody else's.

---

## Step 1 — Firebase (the shared database)

The config is **pre-filled with your existing QAMO 4651 project**, so you can reuse
it. You only need to do three things in the console:

**a) Enable Firestore** (already on if you ran the Screen Time app — skip if so):
Build → Firestore Database → it should already exist.

**b) Publish the security rules.** Firestore Database → **Rules** tab → replace
everything with the contents of `firestore.rules` in this folder → **Publish**.
These rules are **generic and published once for the whole course** — every future
weekly activity reuses them with no further changes. They also keep the legacy
Screen Time app working, so publishing won't break anything.
(See `TEMPLATE.md` for how to clone this app for a new week.)

**c) Enable Anonymous sign-in.** Build → **Authentication** → **Get started** (if
you haven't before) → **Sign-in method** tab → **Anonymous** → **Enable** → Save.
This is what makes "one entry per device, editable" work. If you skip it, students
see *"Couldn't connect (anonymous sign-in is off)."*

> Want a brand-new project instead of reusing the existing one? Create one
> (console.firebase.google.com → Add project), register a web app, and paste its
> six `firebaseConfig` values into `config.js`. Then do a/b/c above on the new
> project.

## Step 2 — Publish to GitHub Pages

1. Create a new GitHub repository, e.g. `meet-the-class` (public).
2. Upload **all** files from this folder (`index.html`, `instructor.html`,
   `core.js`, `config.js`, `styles.css`, `moderation.js`, `places.js`,
   `firestore.rules`, `README.md`, `TEMPLATE.md`).
3. Repo **Settings → Pages → Source:** Deploy from a branch → **main** → **/(root)** → Save.
4. After ~1 minute your pages are live:
   - Student: `https://YOUR-USERNAME.github.io/meet-the-class/`
   - Instructor: `https://YOUR-USERNAME.github.io/meet-the-class/instructor.html`

## Step 3 — QR code for your slide

Open **instructor.html** → click **📱 Student link & QR** → **Download QR (PNG)**.
Drop the PNG onto your first-day slide.

---

## Running it in class

1. Open **instructor.html** on the projector. Enter the passcode **`Scrite4`**.
2. Pick **Section 1** or **Section 2** at the top.
3. Click **🟢 Open form for Section X**. The pill shows **🟢 OPEN**. (Until you open
   it — and after you close it — students who scan the QR see
   *"This is not live at the moment."*)
4. Show the QR. As students submit, watch the five panels fill in live:
   - **1 World map** — home countries (darker = more students).
   - **2 U.S. states** — home states.
   - **3 Favorite shows** — near-duplicate spellings are auto-grouped; the top 15
     show as bars (everything else pooled into **Other**), and the top 5 get
     posters. The "P(most popular)" tile is the probability of the #1 show.
   - **4 Commute** — probability of each commute length, with a matched normal curve.
   - **5 Agreement** — probability of each response to "I feel good about this class."
5. Click **⏹ Close submissions** when you're done collecting.
6. Click **📄 Download PDF report** → your browser's print dialog opens →
   **Save as PDF**. The PDF has clean versions of all the graphs and posters to
   copy into your slides. (**Raw data (.md)** gives just the table of responses.)

> **Two sections:** open for Section 1, run it, **Close**, export the PDF, then
> switch the dropdown to Section 2 and **Open** again for that class.

### Rehearsing before class
Click **🧪 Load test data** to fill the dashboard with ~50 fake submissions
(including some misspelled show titles) so you can practice the whole flow and the
PDF export without students. Real submissions replace the test data on arrival.

### Notes
- **Anonymous.** Only the four answers + a section are stored — no names, no logins.
  The anonymous sign-in is just a random per-device token so a student can edit
  their own entry; it carries no personal information.
- **Editing.** A student who submitted can tap **Edit my answers** to change their
  response. It updates their existing entry instead of adding a new one.
- **Posters** come from TVmaze (free, TV-specific). The maps come from
  world-atlas / us-atlas. All three need an internet connection (so does Firebase).
- **Passcode.** The instructor passcode is `Scrite4`. To change it, tell Claude the
  new passcode (it'll update the hash in `config.js`), or run
  `echo -n "NEW PASSCODE" | shasum -a 256` and paste the result into
  `instructorPasscodeHash`.
