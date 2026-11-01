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

Three test edits were made after the red commit, all my own mistakes and none of them a loosened threshold: (1) M_AMOUNT_DARK counts 4 dark rows, not 6, because D015 and D016 in fixture 02 are created in W44; (2) the slow file in zero_threshold_comes_from_history_not_constant had a last gap of 21 days, so its dates were respaced to a steady 10; (3) in prop_less_evidence_never_more_real the reduction first dropped closed rows with no close day, which removes a bad date finding rather than evidence for REAL, and the cut day was computed with the wrong week arithmetic.

## M3 green

    npx vitest run engine/__tests__/m3   Tests 33 passed (33)
    npx vitest run                       Tests 129 passed (129), run twice
