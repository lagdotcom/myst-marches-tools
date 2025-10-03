import { PCID } from "../common/flavours.js";
import { formatZodError, pcPrefix, zPC } from "../common/types.js";
import { getRedis } from "./_services.js";

export const GET = async () => {
  const redis = await getRedis();

  const keys = (await redis.keys(pcPrefix + "*")) as PCID[];
  const results = keys.length ? await redis.json.mGet(keys, ".") : [];

  return new Response(JSON.stringify(results));
};

export const POST = async (request: Request) => {
  const { error, data: pc } = zPC.safeParse(await request.json());
  if (error)
    return new Response(JSON.stringify({ error: formatZodError(error) }), {
      status: 400,
    });
  const key: PCID = pcPrefix + pc.name;
  pc.id = key;

  const redis = await getRedis();

  if ((await redis.exists(key)) > 0)
    return new Response(JSON.stringify({ error: "already exists" }), {
      status: 400,
    });

  await redis.json.set(key, "$", pc);
  return new Response(null, { status: 201 });
};

export const PUT = async (request: Request) => {
  const { error, data: pc } = zPC.safeParse(await request.json());
  if (error)
    return new Response(JSON.stringify({ error: formatZodError(error) }), {
      status: 400,
    });
  const key = pc.id;

  const redis = await getRedis();

  if ((await redis.exists(key)) === 0)
    return new Response(JSON.stringify({ error: "does not exist" }), {
      status: 400,
    });

  await redis.json.set(key, "$", pc);
  return new Response(null, { status: 200 });
};
