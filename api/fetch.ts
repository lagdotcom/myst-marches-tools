import { PCID } from "../common/flavours.js";
import { cachedFetchJson, getRedis } from "./_services.js";

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

  const characterId = match[1] as PCID;
  const data = await cachedFetchJson(
    redis,
    `ddbcache:${characterId}`,
    `https://character-service.dndbeyond.com/character/v5/character/${characterId}`,
  );
  return new Response(JSON.stringify(data));
};
