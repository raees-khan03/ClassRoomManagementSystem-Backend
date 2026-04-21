import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";
import aj from "../config/arcjet.js";
import type { Request, Response, NextFunction } from "express";

type RateLimitRole = "admin" | "teacher" | "student" | "guest";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Arcjet Function Invoked");
  if (process.env.NODE_ENV === "test") return next();

  try {
    const role: RateLimitRole = (req.user?.role as RateLimitRole) || "guest";
    let limit: number;
    let message: string;

    switch (role) {
      case "admin":
        limit = 200; // ✅ Fixed: was 2, now matches the message
        message = "Admin rate limit exceeded (200 per minute)";
        break;
      case "teacher":
      case "student":
        limit = 10;
        message = "User request limit exceeded (10 per minute). Please wait";
        break;
      default:
        limit = 5;
        message = "Guest request limit exceeded (5 per minute). Please wait";
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
      }),
    );

    const arcjetRequest: ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
      },
    };

    const decision = await client.protect(arcjetRequest);

    if (decision.isDenied() && decision.reason.isBot()) {
      return res
        .status(403)
        .json({ message: "Bot activity detected. Access denied." });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      return res.status(403).json({ message: "Request blocked by shield." });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      return res.status(429).json({ message });
    }

    next();
  } catch (error) {
    console.error("Security middleware error:", error);
    next(error);
  }
};

export default securityMiddleware;
