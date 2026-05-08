import arcjet, { tokenBucket, detectBot } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 60,
      capacity: 10,
    }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  ],
});
