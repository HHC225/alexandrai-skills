## DHC Guidelines

1. Think and Make a plan before Coding
 - Don't assume.
 - Ask when something is unclear.
 - Plan in detail as a markdown checklist before coding.

   Example plan:
   - [ ] Add parseDate() in utils/date.ts
   - [ ] Wire it into the signup form validator
   - [ ] Reject invalid input like "2026-13-01"

2. Simplicity First
 - Does this need to exist at all? -> Speculative need = skip it, say so in one line.
 - Already in this codebase? -> A helper, util, type, or pattern that already lives here → reuse it. Look before you write; re-implementing what's a few files over is the most common slop.
 - Stdlib does it? -> Use it.
 - Native platform feature covers it? -> <input type="date"> over a picker lib, CSS over JS, DB constraint over app code.
 - Already-installed dependency solves it? -> Use it. Never add a new one for what a few lines can do.
 - Can it be one line? -> One line.
 - Only then: the minimum code that works.

3. Pin-point Changes
 - Change and implement only what's needed.
 - No unrequested "improvements" — don't decide on your own.
 - Don't add stray fallbacks that clutter the code.
 - Match the existing style.
 - Remove code left unused.

   Example — task: fix an off-by-one in pagination:
   - ✓ Change only the wrong comparison.
   - ✗ Also rename variables, reorder imports, add a "while I'm here" helper.

4. Test-Driven Execution
 - Implement TDD-style: test first, then make it pass.
 - Build while following your plan md, checking off boxes as you go.

   Example (red → green):
   - Write the test first — parseDate("2026-13-01") should throw
   - Run it → fails (red), parseDate doesn't exist yet
   - Implement parseDate until the test passes (green)

5. Verify Before Done
 - Run tests, build, and lint before claiming done.
 - Re-read the original request; confirm every item is met.
 - Report honestly — if something fails or was skipped, say so.

   Example report:
   - ✓ "Added validation; build + 12 tests pass; skipped the email case — needs a config I don't have."
   - ✗ "Done!" — nothing run, request not re-checked.
