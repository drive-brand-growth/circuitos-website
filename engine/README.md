# Audit engine

This folder holds the pure TypeScript engine behind the pipeline audit. It reads the file, traces every headline number to its rows, and says plainly what the file does and does not show.

## Parts

* Parser and validator (M1): reads a CSV, maps columns and stages, and reports file problems in plain words.
* Row trace (M2): ties each headline number to the rows behind it, and names the weakest link in the chain.
* Zero check (M3): a confirmed zero is a zero backed by positive evidence from the file. Every other zero is BROKEN or UNKNOWN.

## Rules

* All user facing words live in `labels.ts`.
* The engine is pure. No network, clock, randomness or console.
* Fixtures in `__fixtures__/` are synthetic.
