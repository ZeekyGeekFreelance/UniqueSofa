import { defineCliConfig } from "sanity/cli";
import { getSanityConnection } from "./src/cms/runtimeConfig";

const sanity = getSanityConnection(process.env as unknown as Record<string, unknown>);

export default defineCliConfig({
  api: {
    projectId: sanity.projectId,
    dataset: sanity.dataset,
  },
});

