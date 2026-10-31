# RED_LOG

Failing output captured before implementation. Dates are the build date, 2026-10-31.

## M1 red run (stubs throw 'not implemented')

    npx vitest run engine/__tests__/m1
    Test Files  5 failed (5)
    Tests  53 failed | 2 passed (55)

The 2 that passed at stub time are structural checks that do not need the code: engine_is_pure (the stubs contain no banned API) and fixtures_are_labeled_synthetic (the fixtures already exist). All 53 failures are 'not implemented' or assertion failures, none are import errors.
