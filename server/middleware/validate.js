// Lightweight in-memory rate limiter for spam protection
const submissionLog = new Map();

export function rateLimitSubmissions(windowMs = 60000, maxRequests = 10) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = submissionLog.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    submissionLog.set(ip, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before submitting again.'
      });
    }

    next();
  };
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}
