import jwt from "jsonwebtoken";

/**
 * ======================================================
 * AUTH CONFIGURATION
 * ======================================================
 * This file handles JWT (JSON Web Token) creation and verification.
 *
 * JWTs are used to:
 * - Identify users after login
 * - Persist sessions without storing state on the server
 * - Protect API routes using signed tokens
 * ======================================================
 */

/**
 * Secret used to sign and verify JWTs.
 * 
 * IMPORTANT:
 * - Stored in environment variables for security
 * - Never expose in frontend code
 * - If this is compromised, all tokens become invalid
 */
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Exporting secret (not commonly needed elsewhere,
 * but kept in your structure as-is).
 */
export default JWT_SECRET;

/**
 * ======================================================
 * SIGN TOKEN
 * ======================================================
 * Creates a JWT for a user after login or registration.
 *
 * Payload:
 * - userId: stored inside the token
 *
 * Expiration:
 * - 7 days (user will need to re-auth after expiry)
 *
 * Flow:
 * 1. User logs in
 * 2. Server validates credentials
 * 3. Token is created and sent to client as cookie
 */
export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * ======================================================
 * VERIFY TOKEN
 * ======================================================
 * Validates a JWT sent from the client.
 *
 * Returns:
 * - Decoded payload if valid
 * - null if invalid or expired
 *
 * Flow:
 * 1. Read token from cookies
 * 2. Verify signature using JWT_SECRET
 * 3. Extract userId if valid
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (err) {
    // Token is invalid, expired, or tampered with
    return null;
  }
}