# Audit engine

This folder holds the pure TypeScript engine behind the pipeline audit. It follows The Circuit Method: read the file, trace every headline number to its rows, and say plainly what the file does and does not show.

## Parts

* Parser and validator (M1): reads a CSV, maps columns and stages, and reports file problems in plain words.
* Signal Tracing (M2): ties each headline number to the rows behind it, and names the weakest link in the chain.
* Live Zero check (M3): a Live Zero is a zero confirmed real by positive evidence from the file. Every other zero is BROKEN or UNKNOWN.

## Rules

* All user facing words live in `labels.ts`.
* The engine is pure. No network, clock, randomness or console.
* The Circuit Method is used in report and doc level text only.
* Fixtures in `__fixtures__/` are synthetic.
