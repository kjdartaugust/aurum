/**
 * Tiny Vercel KV (Upstash Redis) client over its REST API — no SDK dependency.
 *
 * When you create a KV store in the Vercel dashboard and link it to the project,
 * Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. If
 * they're absent (e.g. local dev), callers fall back to in-memory storage.
 */
const URL_ = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

export const kvEnabled = Boolean(URL_ && TOKEN);

async function command(cmd: (string | number)[]): Promise<unknown> {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV command failed: ${res.status}`);
  const json = (await res.json()) as { result: unknown };
  return json.result;
}

export async function kvSet(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<void> {
  const cmd: (string | number)[] = ["SET", key, value];
  if (ttlSeconds) cmd.push("EX", ttlSeconds);
  await command(cmd);
}

export async function kvGet(key: string): Promise<string | null> {
  return (await command(["GET", key])) as string | null;
}

/** SET key value NX — returns true only if the key did not already exist. */
export async function kvSetNx(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<boolean> {
  const cmd: (string | number)[] = ["SET", key, value, "NX"];
  if (ttlSeconds) cmd.push("EX", ttlSeconds);
  return (await command(cmd)) === "OK";
}
