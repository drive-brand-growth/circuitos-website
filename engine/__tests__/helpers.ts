import fs from 'node:fs';
import { serialize, tokenize } from '../csv';
import { runAudit, type AuditResult } from '../audit';
import { makeParams } from '../params';
import { parseFile } from '../parse';
import type { Params, ParseOptions, ParseResult, NormalRow, Finding, TraceCard, MetricId, ParseMeta, StageMapping } from '../types';

export const KEY = 'test-key-not-a-secret';
const FIX = new URL('../__fixtures__/', import.meta.url);

export function fixtureBytes(name: string): Uint8Array {
  return new Uint8Array(fs.readFileSync(new URL(`${name}.csv`, FIX)));
}

export interface FixtureMeta {
  synthetic: boolean;
  purpose: string;
  params: { as_of: string; report_tz: string; stage_mapping?: StageMapping; stage_order?: string[] };
  expect: Record<string, unknown>;
}

export function fixtureMeta(name: string): FixtureMeta {
  return JSON.parse(fs.readFileSync(new URL(`${name}.meta.json`, FIX), 'utf8')) as FixtureMeta;
}

export function enc(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

export function opts(extra: Partial<ParseOptions> = {}): ParseOptions {
  return { reportTz: 'America/Chicago', hmacKey: KEY, ...extra };
}

export function params(extra: Partial<Params> = {}): Params {
  return makeParams({ asOf: '2026-10-30', reportTz: 'America/Chicago', ...extra });
}

// Options and params that a fixture sidecar asks for.
export function forFixture(name: string, tz?: string): { o: ParseOptions; p: Params } {
  const m = fixtureMeta(name).params;
  const reportTz = tz ?? m.report_tz;
  return { o: opts({ reportTz, stageMapping: m.stage_mapping }), p: makeParams({ asOf: m.as_of, reportTz }) };
}

export function parseOk(bytes: Uint8Array, o: ParseOptions = opts()): { rows: NormalRow[]; meta: ParseMeta; findings: Finding[] } {
  const r: ParseResult = parseFile(bytes, o);
  if (!r.ok) throw new Error(`expected ok, got ${r.error.code} ${JSON.stringify(r.error.detail)}`);
  return r;
}

export function auditOk(bytes: Uint8Array, o: ParseOptions, p: Params): Extract<AuditResult, { ok: true }> {
  const r = runAudit(bytes, o, p);
  if (!r.ok) throw new Error(`expected ok, got ${r.error.code}`);
  return r;
}

export function auditFixture(name: string, tz?: string): Extract<AuditResult, { ok: true }> {
  const { o, p } = forFixture(name, tz);
  return auditOk(fixtureBytes(name), o, p);
}

export function card(res: { cards: TraceCard[] }, metric: MetricId, currency = 'UNSTATED'): TraceCard {
  const c = res.cards.find((x) => x.metricId === metric && x.currency === currency);
  if (!c) throw new Error(`no card ${metric} ${currency}`);
  return c;
}

export function finding(findings: Finding[], code: string): Finding | undefined {
  return findings.find((f) => f.code === code);
}

export function tableOf(bytes: Uint8Array): string[][] {
  const text = new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, '');
  return tokenize(text, ',').records.map((r) => r.cells);
}

export function csvOf(table: string[][]): Uint8Array {
  return enc(serialize(table));
}

// Test mutation helper: apply an edit to the fixture table (header is row 0) and return new bytes.
export function mutate(name: string, edit: (table: string[][]) => void): Uint8Array {
  const t = tableOf(fixtureBytes(name));
  edit(t);
  return csvOf(t);
}

export const HEADER5 = 'Record ID,Deal Stage,Amount,Close Date,Create Date';
export const HEADER6 = `${HEADER5},Last Modified Date`;

export function allFixtureNames(): string[] {
  return fs
    .readdirSync(FIX)
    .filter((f) => f.endsWith('.csv'))
    .map((f) => f.replace(/\.csv$/, ''));
}
