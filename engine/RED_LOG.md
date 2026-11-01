# RED_LOG

Failing output captured before implementation. Dates are the build date, 2026-10-31.

## M1 red run (stubs throw 'not implemented')

    npx vitest run engine/__tests__/m1
    Test Files  5 failed (5)
    Tests  53 failed | 2 passed (55)

The 2 that passed at stub time are structural checks that do not need the code: engine_is_pure (the stubs contain no banned API) and fixtures_are_labeled_synthetic (the fixtures already exist). All 53 failures are 'not implemented' or assertion failures, none are import errors.

## M2 red run (stubs throw 'not implemented')

    npx vitest run engine/__tests__/m2
    Tests  37 failed | 1 passed (38)

The one that passed at stub time is labels_hold_the_trace_words, which only reads labels.ts written in M1. Every failure is 'not implemented' (the property tests report it as the cause of the failed property), none is an import error.

## M3 red run (stubs throw 'not implemented')

    npx vitest run engine/__tests__/m3
    Test Files  2 failed (2)
    Tests  31 failed | 2 passed (33)

The 2 that passed at stub time need no new code: evidence_p90_nearest_rank_small_sets (the nearest rank percentile came with M2) and zero_constants_live_in_params_only (the stub holds no numeric literal). The other 31 fail with 'not implemented'; the 5 property tests report it as the cause of the failed property. None is an import error.
