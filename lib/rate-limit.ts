/**
 * Minimal in-memory rate limiter (per warm serverless instance).
 *
 * Good enough to blunt casual abuse/spam. For strict, multi-instance limits in
 * production, back this with a shared store (e.g. Upstash Redis / Vercel KV).
 * TODO (client): swap to a distributed limiter if you see abuse at scale.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > max;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
