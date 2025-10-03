import { createClient, RedisJSON } from "redis";

import { Seconds, WebURL } from "../common/flavours.js";

export const getRedis = () =>
  createClient({ url: process.env.REDIS_URL }).connect();
type Redis = Awaited<ReturnType<typeof getRedis>>;

export async function cachedFetchJson(
  redis: Redis,
  key: string,
  url: WebURL,
  ttl: Seconds = 60 * 60,
) {
  const cached = await redis.json.get(key);
  if (cached) return cached;

  const result = await fetch(url);
  const data = (await result.json()) as RedisJSON;

  // TODO api error handling

  await redis.json.set(key, "$", data);
  await redis.expire(key, ttl);

  return data;
}
