export function normalizeSocialUrl(input: string | undefined, platform: 'telegram' | 'twitter'): string | undefined {
  if (!input) return undefined;

  // Remove leading/trailing whitespace
  const trimmed = input.trim();

  // Patterns for Telegram and Twitter/X
  const telegramPattern = /^(?:https?:\/\/)?(?:www\.)?(?:t\.me\/|telegram\.me\/|@)?([\w]{5,32})$/;
  const twitterPattern = /^(?:https?:\/\/)?(?:www\.)?(?:x\.com\/|twitter\.com\/|@)?([\w]{1,15})$/;

  if (platform === 'telegram') {
    const match = trimmed.match(telegramPattern);
    if (match && match[1]) {
      return `https://t.me/${match[1]}`;
    }
  } else if (platform === 'twitter') {
    const match = trimmed.match(twitterPattern);
    if (match && match[1]) {
      return `https://x.com/${match[1]}`;
    }
  }

  return undefined; // Return undefined if invalid
}