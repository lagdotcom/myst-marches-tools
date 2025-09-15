import { createClient } from "redis";

export const GET = async () => {
  const redis = await createClient().connect();

  await redis.set("item", 12);

  // Fetch data from Redis
  const result = await redis.get("item");

  // Return the result in the response
  return new Response(JSON.stringify({ result }), { status: 200 });
};
