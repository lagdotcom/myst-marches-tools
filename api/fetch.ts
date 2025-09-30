import { createClient, RedisJSON } from "redis";

const getRedis = () => createClient({ url: process.env.REDIS_URL }).connect();
type Redis = Awaited<ReturnType<typeof getRedis>>;

async function cachedFetchJson(
  redis: Redis,
  key: string,
  url: string,
  ttl: number = 60 * 60
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

export const GET = async (req: Request) => {
  const redis = await getRedis();
  const u = new URL(req.url);
  const pcId = u.searchParams.get("id");
  if (!pcId)
    return new Response(JSON.stringify({ error: "missing id" }), {
      status: 400,
    });

  const pc = await redis.json.GET(pcId);
  const ddb = (pc as { beyondUrl: string }).beyondUrl;
  if (!ddb)
    return new Response(JSON.stringify({ error: "no beyondUrl" }), {
      status: 400,
    });

  const match = /characters\/(\d+)/.exec(ddb);
  if (!match)
    return new Response(JSON.stringify({ error: "bad beyondUrl" }), {
      status: 400,
    });

  const characterId = match[1];
  const data = await cachedFetchJson(
    redis,
    `ddbcache:${characterId}`,
    `https://character-service.dndbeyond.com/character/v5/character/${characterId}`
  );
  return new Response(JSON.stringify(data));
};
