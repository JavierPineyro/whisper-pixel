import { type Config } from "drizzle-kit";

import { env } from "~/env"; // No eliminar esto, es necesario para que funcione el drizzle.config.ts

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["whisper-pixel_*"],
  dbCredentials: {
    host: env.SINGLESTORE_HOST,
    port: Number(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {}
  },
} satisfies Config;
