// config/arcjet.ts
import arcjet, { shield, detectBot } from "@arcjet/node";

if (!process.env.ARCJET_SECRET_KEY && process.env.NODE_ENV !== "test") {
  throw new Error("Missing ARCJET_KEY environment variable");
}

const aj = arcjet({
  key: process.env.ARCJET_SECRET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    // ✅ slidingWindow HATA DIYA — middleware mein role ke hisaab se lagega
  ],
});

export default aj;
