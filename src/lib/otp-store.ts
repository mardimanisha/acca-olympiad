/**
 * Small key-value store with expiry for OTP rate limits and one-time-use flags. Uses Upstash Redis over its REST API
 * when configured (the Vercel Marketplace integration sets KV_REST_API_URL / KV_REST_API_TOKEN; a direct Upstash
 * database gives UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Without them it falls back to memory in this
 * process, which is fine for local development but not on Vercel, where every function instance has its own memory.
 */

type Entry = { value: string; expires: number };

const memory: Map<string, Entry> = ((globalThis as { __otpStore?: Map<string, Entry> }).__otpStore ??= new Map());
let warned = false;

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  if (process.env.NODE_ENV === "production" && !warned) {
    warned = true;
    console.warn("otp-store: no Redis configured, using in-memory store (rate limits are per instance)");
  }
  return null;
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const { url, token } = redisConfig()!;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  const reply = (await res.json().catch(() => null)) as { result?: unknown; error?: string } | null;
  if (!res.ok || !reply || reply.error) throw new Error(`otp-store: redis replied ${res.status} ${JSON.stringify(reply)}`);
  return reply.result;
}

function live(key: string): Entry | null {
  const e = memory.get(key);
  if (!e) return null;
  if (Date.now() > e.expires) {
    memory.delete(key);
    return null;
  }
  return e;
}

/** Adds 1 to the counter and returns the new count; the counter's window starts at the first hit and lasts `seconds`. */
export async function hit(key: string, seconds: number): Promise<number> {
  if (redisConfig()) {
    const n = Number(await redis(["INCR", key]));
    if (n === 1) await redis(["EXPIRE", key, seconds]);
    return n;
  }
  const e = live(key);
  const n = (e ? Number(e.value) : 0) + 1;
  memory.set(key, { value: String(n), expires: e?.expires ?? Date.now() + seconds * 1000 });
  return n;
}

/** Sets the key only when it isn't set yet. Returns true when it was set, false when it already existed. */
export async function claim(key: string, seconds: number, value = "1"): Promise<boolean> {
  if (redisConfig()) return (await redis(["SET", key, value, "NX", "EX", seconds])) === "OK";
  if (live(key)) return false;
  memory.set(key, { value, expires: Date.now() + seconds * 1000 });
  return true;
}

/** Seconds until the key expires, or 0 when it isn't set. */
export async function ttl(key: string): Promise<number> {
  if (redisConfig()) return Math.max(0, Number(await redis(["TTL", key])));
  const e = live(key);
  return e ? Math.ceil((e.expires - Date.now()) / 1000) : 0;
}

export async function get(key: string): Promise<string | null> {
  if (redisConfig()) {
    const v = await redis(["GET", key]);
    return v == null ? null : String(v);
  }
  return live(key)?.value ?? null;
}

export async function set(key: string, value: string, seconds: number): Promise<void> {
  if (redisConfig()) {
    await redis(["SET", key, value, "EX", seconds]);
    return;
  }
  memory.set(key, { value, expires: Date.now() + seconds * 1000 });
}

export async function del(key: string): Promise<void> {
  if (redisConfig()) {
    await redis(["DEL", key]);
    return;
  }
  memory.delete(key);
}
