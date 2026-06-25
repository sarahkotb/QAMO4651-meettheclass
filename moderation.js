/* =============================================================
   Optional, OFF by default.
   The first-day survey runs as a friendly icebreaker, so no content
   filtering is applied. This file just provides a no-op hook so the
   pages have something to call.

   If you ever want to screen free-text answers, add lowercase words
   to BLOCKLIST below (e.g. ["someword"]). Matching is word-boundary
   based, so ordinary place/show names won't be caught. Leave the
   array empty to keep filtering disabled.
   ============================================================= */
(function () {
  const BLOCKLIST = [];                       // empty → no filtering
  const SET = new Set(BLOCKLIST.map(w => w.toLowerCase()));

  // Returns the first matching word in `text`, or null. With an empty
  // BLOCKLIST this always returns null.
  function hit(text) {
    if (!text || SET.size === 0) return null;
    for (const tok of text.toLowerCase().split(/[^a-z]+/)) {
      if (tok && SET.has(tok)) return tok;
    }
    return null;
  }
  function firstHit(fields) {
    for (const f of fields) { const h = hit(f); if (h) return h; }
    return null;
  }
  function isClean(text) { return hit(text) == null; }

  window.MODERATION = { hit, firstHit, isClean };
})();
