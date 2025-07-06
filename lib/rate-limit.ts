// Simple in-memory rate limiter for portfolio APIs
// This protects against API abuse without requiring external services

interface RateLimit {
  count: number;
  resetTime: number;
}

class MemoryRateLimiter {
  private store = new Map<string, RateLimit>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(identifier: string): {
    success: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = identifier;

    // Clean up old entries periodically
    this.cleanup(now);

    const current = this.store.get(key);

    if (!current || now > current.resetTime) {
      // First request or window expired
      const resetTime = now + this.windowMs;
      this.store.set(key, { count: 1, resetTime });
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    if (current.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }

    // Increment counter
    current.count++;
    this.store.set(key, current);

    return {
      success: true,
      remaining: this.maxRequests - current.count,
      resetTime: current.resetTime,
    };
  }

  private cleanup(now: number) {
    // Remove expired entries to prevent memory leaks
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Create rate limiters for different endpoints
export const publicApiLimiter = new MemoryRateLimiter(100, 60 * 60 * 1000); // 100 requests per hour
export const contactLimiter = new MemoryRateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes

// Helper function to get client identifier
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers (for production deployment)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip =
    forwarded?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown";

  return ip;
}

// Middleware function to apply rate limiting
export async function withRateLimit(
  request: Request,
  limiter: MemoryRateLimiter,
  handler: () => Promise<Response>
): Promise<Response> {
  const identifier = getClientIdentifier(request);
  const result = limiter.check(identifier);

  if (!result.success) {
    const resetDate = new Date(result.resetTime);
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        resetTime: resetDate.toISOString(),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil(
            (result.resetTime - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Limit": limiter["maxRequests"].toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.resetTime.toString(),
        },
      }
    );
  }

  // Execute the original handler
  const response = await handler();

  // Add rate limit headers to successful responses
  response.headers.set("X-RateLimit-Limit", limiter["maxRequests"].toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.resetTime.toString());

  return response;
}
