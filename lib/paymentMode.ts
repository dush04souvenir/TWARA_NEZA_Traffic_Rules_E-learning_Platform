// lib/paymentMode.ts
/**
 * Determines whether the application should run in mock‑payment mode.
 * Set `PAYMENT_MODE=mock` in .env to enable.
 */
export const isMock = (process.env.PAYMENT_MODE ?? "mock").toLowerCase() === "mock";
