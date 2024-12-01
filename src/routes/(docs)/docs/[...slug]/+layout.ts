import type { DocumentationMeta } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params }) => {
  try {
    const filePath = `../../../../docs/${params.slug}.md`;
    const post = await import(filePath);

    return {
      content: post.default,
      meta: post.metadata as DocumentationMeta,
    };
  } catch (e) {
    console.error(e);
    if (e && typeof e === "object" && "message" in e) {
      error(404, `${JSON.stringify(e, null, 2)}`);
    }
    error(404, `Could not find ${params.slug}`);
  }
};
