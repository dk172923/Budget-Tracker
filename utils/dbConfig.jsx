import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// DATABASE_URL is a server-only secret. Never prefix it with NEXT_PUBLIC_,
// or Next.js will ship it to every visitor's browser.
// The connection is created on first use so `next build` works without it.
let instance;

function getDb() {
  if (!instance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
    }
    instance = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return instance;
}

export const db = new Proxy({}, {
  get(_target, prop) {
    const real = getDb();
    const value = real[prop];
    return typeof value === 'function' ? value.bind(real) : value;
  },
});
