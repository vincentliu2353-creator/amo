import { buildLlmsTxt } from "@/lib/llms";

export function GET() {
  const content = buildLlmsTxt();

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
