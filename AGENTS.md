## Implement Guidelines

1. Think and Make a plan before Coding
 - Make a target.
 - Don't assume.
 - Ask when something is unclear.
 - Before coding, create `docs/` under the current working directory, then create `docs/completed/` under it, if it does not exist.
 - Write the plan as a detailed markdown checklist in `docs/YYYYMMDD-HHMMSS-title-plan.md`; every plan filename must end with `-plan.md`.
 - Use the current local time for `YYYYMMDD-HHMMSS` and a short kebab-case task name for `title`.
 - Make the plan as detailed as possible before implementation: include discovery steps, exact files or areas to inspect, files likely to change, tests to add or run, verification steps, rollback or cleanup needs, and known assumptions.
 - Clearly document task dependencies in the plan: state which tasks must happen first, which tasks depend on earlier results, and which tasks can run independently or in parallel.
 - Check off items in the plan as work progresses.

   Example plan:
   `docs/20260623-143012-fix-signup-date-validation-plan.md`
   - [ ] Task 1: Inspect existing date validation helpers and signup form code. Dependency: none.
   - [ ] Task 2: Add or update the failing test for invalid input like "2026-13-01". Dependency: Task 1 identifies the right test file.
   - [ ] Task 3: Implement the smallest validation change needed. Dependency: Task 2 defines the expected failing behavior.
   - [ ] Task 4: Run the focused test, then run lint/build if available. Dependency: Task 3 is complete.
   - [ ] Task 5: Move this plan to `docs/completed/` after verification. Dependency: Task 4 passes or any failures are documented.

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
 - Write the smallest failing test first for the requested behavior or regression.
 - Run it and confirm it fails for the expected reason before implementation.
 - Implement the minimum code needed to make that test pass.
 - Add edge-case tests only when required by the request or discovered risk.
 - Refactor only after tests are green, then rerun the relevant tests.
 - Build while following your plan md, checking off boxes as you go.

   Example (red → green):
   - Write the smallest test first — parseDate("2026-13-01") should throw
   - Run it → fails for the expected reason
   - Implement the minimum validation change until the test passes

5. Verify Before Done
 - Confirm the initially selected goal before claiming done.
 - If the goal is not satisfied, return to step 1, but do not fully reset the work: actively reuse the information learned in the previous loop.
 - The new step 1 plan must layer on top of prior findings, decisions, failed attempts, partial implementation, test results, and unresolved checklist items; create a new detailed `docs/YYYYMMDD-HHMMSS-title-plan.md`, document the updated task dependencies, and continue from that plan.
 - Run tests, build, and lint before claiming done.
 - Verify the active plan markdown before claiming done: every checkbox must match the real task state.
 - For any unchecked plan checkbox, inspect and verify that task; check it off if it is complete, or leave it unchecked and report why it is still unresolved.
 - Move the plan markdown file into `docs/completed/` only after verification is complete and all applicable checkboxes are checked.
 - Re-read the original request; confirm every item is met.
 - Report honestly — if something fails or was skipped, say so.

   Example report:
   - ✓ "Initial goal confirmed; added validation; build + 12 tests pass; plan checklist verified and moved to docs/completed/; skipped the email case — needs a config I don't have."
   - ✗ "Done!" — nothing run, request not re-checked.
