import { type Config } from "drizzle-kit";

import { env } from "~/env"; // No eliminar esto, es necesario para que funcione el drizzle.config.ts

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["whisper-pixel_*"],
} satisfies Config;
