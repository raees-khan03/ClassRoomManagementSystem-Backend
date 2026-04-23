import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema/auth.js";
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: process.env.FRONT_END_URL
    ? [process.env.FRONT_END_URL]
    : ["http://localhost:5173"],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        default: "student",
        input: true,
      },

      imageCldPublicId: {
        type: "string",
        required: false,
        default: "student",
        input: true,
      },
    },
  },
});
