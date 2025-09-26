import { createClient } from "redis";
import * as z from "zod";

export const getRedis = () =>
  createClient({ url: process.env.REDIS_URL }).connect();

const ClassLevel = z.object({
  name: z.string(),
  level: z.number(),
  subclass: z.optional(z.string()),
});

const PC = z.object({
  id: z.string().startsWith("pc:"),
  name: z.string(),
  player: z.string(),
  species: z.string(),
  beyondUrl: z
    .string()
    .url()
    .startsWith(
      "https://www.dndbeyond.com/characters",
      "beyond URL looks wrong"
    ),
  classLevels: z.array(ClassLevel).min(1, "must have at least one class"),
});

function formatZodError<T>(error: z.ZodError<T>) {
  const flat = error.flatten();
  const errors = flat.formErrors;

  for (const v of Object.values(flat.fieldErrors))
    if (v) errors.push(...(v as string[]));

  return errors.join("\n");
}

export const GET = async () => {
  const redis = await getRedis();

  const keys = await redis.KEYS("pc:*");
  const results = keys.length ? await redis.json.MGET(keys, ".") : [];

  return new Response(JSON.stringify({ results }), { status: 200 });
};

export const POST = async (request: Request) => {
  const { error, data: pc } = PC.safeParse(await request.json());
  if (error)
    return new Response(JSON.stringify({ error: formatZodError(error) }), {
      status: 400,
    });
  const key = `pc:${pc.name}`;
  pc.id = key;

  const redis = await getRedis();

  if ((await redis.EXISTS(key)) > 0)
    return new Response(JSON.stringify({ error: "already exists" }), {
      status: 400,
    });

  await redis.json.SET(key, "$", pc);
  return new Response(null, { status: 201 });
};

export const PUT = async (request: Request) => {
  const { error, data: pc } = PC.safeParse(await request.json());
  if (error)
    return new Response(JSON.stringify({ error: formatZodError(error) }), {
      status: 400,
    });
  const key = pc.id;

  const redis = await getRedis();

  if ((await redis.EXISTS(key)) === 0)
    return new Response(JSON.stringify({ error: "does not exist" }), {
      status: 400,
    });

  await redis.json.SET(key, "$", pc);
  return new Response(null, { status: 200 });
};
