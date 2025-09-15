import { createClient } from "redis";

const notNull = (s: string | null): s is string => typeof s === "string";

export const GET = async () => {
  const redis = await createClient({ url: process.env.REDIS_URL }).connect();

  const keys = await redis.keys("pc:*");
  const results = keys.length ? await redis.mGet(keys) : [];

  return new Response(
    JSON.stringify({
      results: results.filter(notNull).map((x) => JSON.parse(x)),
    }),
    { status: 200 }
  );
};

export const POST = async (request: Request) => {
  const data = await request.json();
  // TODO validate

  const key = `pc:${data.name}`;

  const redis = await createClient({ url: process.env.REDIS_URL }).connect();

  if ((await redis.exists(key)) > 0)
    return new Response(JSON.stringify({ error: "already exists" }), {
      status: 400,
    });

  await redis.set(key, JSON.stringify(data));
  return new Response(null, { status: 201 });
};

export const PUT = async (request: Request) => {
  const data = await request.json();
  // TODO validate

  const key = `pc:${data.name}`;

  const redis = await createClient({ url: process.env.REDIS_URL }).connect();

  if ((await redis.exists(key)) === 0)
    return new Response(JSON.stringify({ error: "does not exist" }), {
      status: 400,
    });

  await redis.set(key, JSON.stringify(data));
  return new Response(null, { status: 201 });
};
