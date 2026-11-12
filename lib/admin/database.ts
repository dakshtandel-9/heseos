// A small D1-style wrapper over Turso (libSQL), so the commerce/admin routes keep their
// `db().prepare(sql).bind(...).first()/all()/run()` and `db().batch([...])` calls unchanged.
// Turso is SQLite, the same SQL dialect as Cloudflare D1, so the queries and triggers run as-is.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createClient, type Client, type InValue, type ResultSet } from '@libsql/client';

type Value = string | number | bigint | boolean | null | undefined | ArrayBuffer | Uint8Array;

const toArg = (v: Value): InValue => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v instanceof ArrayBuffer ? new Uint8Array(v) : v);
const rows = <T>(r: ResultSet) => r.rows.map(row => Object.fromEntries(r.columns.map((c, i) => [c, row[i]])) as T);

export class Statement {
  constructor(private readonly ready: () => Promise<Client>, readonly sql: string, readonly args: InValue[] = []) {}
  bind(...values: Value[]) { return new Statement(this.ready, this.sql, values.map(toArg)); }
  private async exec() { return (await this.ready()).execute({ sql: this.sql, args: this.args }); }
  async first<T = Record<string, unknown>>(): Promise<T | null> { return rows<T>(await this.exec())[0] ?? null; }
  async all<T = Record<string, unknown>>() { return { results: rows<T>(await this.exec()) }; }
  async run() { const r = await this.exec(); return { meta: { changes: r.rowsAffected, last_row_id: r.lastInsertRowid } }; }
}

class Database {
  private client?: Client;
  private schema?: Promise<void>;

  private connect() {
    if (this.client) return this.client;
    const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || (process.env.VERCEL ? '' : 'file:.data/local.db');
    if (!url) throw new Error('Database is not configured: add the Turso integration (TURSO_DATABASE_URL) to this Vercel project.');
    this.client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN, intMode: 'number' });
    return this.client;
  }

  // Applies drizzle/*.sql once per server instance. Every statement there is IF NOT EXISTS, so this is safe to repeat.
  private readonly ready = async () => {
    const client = this.connect();
    this.schema ??= (async () => {
      const dir = path.join(process.cwd(), 'drizzle');
      for (const file of (await readdir(dir)).filter(f => f.endsWith('.sql')).sort()) await client.executeMultiple(await readFile(path.join(dir, file), 'utf8'));
    })().catch(e => { this.schema = undefined; throw e; });
    await this.schema;
    return client;
  };

  prepare(sql: string) { return new Statement(this.ready, sql); }

  // Runs the statements in one write transaction, like D1's batch.
  async batch(statements: Statement[]) {
    const results = await (await this.ready()).batch(statements.map(s => ({ sql: s.sql, args: s.args })), 'write');
    return results.map(r => ({ results: rows(r), meta: { changes: r.rowsAffected } }));
  }
}

let instance: Database | undefined;
export const database = () => (instance ??= new Database());
