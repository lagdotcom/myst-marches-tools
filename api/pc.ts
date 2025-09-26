import { createClient } from "redis";

export const getRedis = () =>
  createClient({ url: process.env.REDIS_URL }).connect();

export const GET = async () => {
  const redis = await getRedis();

  const keys = await redis.KEYS("pc:*");
  const results = keys.length ? await redis.json.MGET(keys, ".") : [];

  return new Response(JSON.stringify({ results }), { status: 200 });
};

export const POST = async (request: Request) => {
  const data = await request.json();
  // TODO validate

  const key = `pc:${data.id}`;

  const redis = await getRedis();

  if ((await redis.EXISTS(key)) > 0)
    return new Response(JSON.stringify({ error: "already exists" }), {
      status: 400,
    });

  await redis.json.SET(key, "$", data);
  return new Response(null, { status: 201 });
};

export const PUT = async (request: Request) => {
  const data = await request.json();
  // TODO validate

  const key = data.id;

  const redis = await getRedis();

  if ((await redis.EXISTS(key)) === 0)
    return new Response(JSON.stringify({ error: "does not exist" }), {
      status: 400,
    });

  await redis.json.SET(key, "$", data);
  return new Response(null, { status: 201 });
};
