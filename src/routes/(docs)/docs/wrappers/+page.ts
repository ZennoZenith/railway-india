import type { DocumentationMeta } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  try {
    const post = await import(`../../../../docs/wrappers.md`);

    return {
      content: post.default,
      meta: post.metadata as DocumentationMeta,
    };
  } catch (e) {
    console.error(e);
    if (e && typeof e === "object" && "message" in e) {
      error(404, `${JSON.stringify(e, null, 2)}`);
    }
    error(404, `Could not find operations`);
  }
};
