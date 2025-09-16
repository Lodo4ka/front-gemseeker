import { z, object, string, boolean } from 'zod';
import { normalizeSocialUrl } from '../lib';

const patterns = {
  youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  vimeo: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
  dailymotion: /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/,
  wistia: /(?:https?:\/\/)?(?:www\.)?(?:wistia\.com|wi\.st)\/(?:medias|embed\/iframe)\/([a-zA-Z0-9]+)/,
  vidyard: /(?:https?:\/\/)?(?:www\.)?(?:play\.vidyard\.com|vidyard\.com)\/([a-zA-Z0-9_-]+)/,
  rumble: /(?:https?:\/\/)?(?:www\.)?rumble\.com\/(?:v|embed\/)([a-zA-Z0-9_-]+)/,
  videoFile: /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|ts)$/i,
};

const isValidVideoUrl = (url: string) =>
  Object.values(patterns).some((regex) => regex.test(url));

export const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp'];
export const CREATE_TOKEN_MODAL = 'CREATE_TOKEN_MODAL';

export const formSchema = object({
  token_name: string()
    .min(3, 'Token name must be at least 3 characters long.')
    .max(20, 'Token name cannot exceed 20 characters.'),
  ticker: string().min(3, 'Ticker must be at least 3 characters long.').max(4, 'Ticker cannot exceed 4 characters.'),
  amount_to_buy: string().optional(),
  description: string().min(15, 'Token description must be at least 10 characters long.'),
  preview: string()
    .optional()
    .refine((val) => !val || isValidVideoUrl(val), {
      message:
        'Invalid video URL. Supported: YouTube, Vimeo, Dailymotion, Wistia, Vidyard, Rumble, or direct .mp4/.webm/.mov etc.',
    }),
  livestream: boolean().optional(),
  nsfw: boolean().optional(),
  image: z
    .instanceof(File, { message: 'Please upload a valid file.' })
    .refine((file) => ALLOWED_TYPES.includes(file.type), {
      message: `Please select an allowed file type: ${ALLOWED_TYPES.join(', ')}`,
    })
    .nullable()
    .refine((file) => file !== null, {
      message: 'Please upload a file.',
    }),
  socials: z
    .object({
      website: z
        .string()
        .optional()
        .transform((val) => (val === '' ? undefined : val))
        .refine(
          (val) => {
            if (!val) return true; // Allow undefined
            try {
              new URL(val); // Validate URL format
              return true;
            } catch {
              return false;
            }
          },
          { message: 'Website must be a valid URL (e.g., https://example.com)' },
        ),
      telegram: z
        .string()
        .optional()
        .transform((val) => (val === '' ? undefined : val))
        .refine(
          (val) => {
            if (!val) return true; // Allow undefined
            const telegramPattern = /^(?:https?:\/\/)?(?:www\.)?(?:t\.me\/|telegram\.me\/|@)?([\w]{5,32})$/;
            return telegramPattern.test(val);
          },
          {
            message:
              'Telegram must be a valid handle (e.g., @username, t.me/username, or https://t.me/username)',
          },
        )
        .transform((val) => normalizeSocialUrl(val, 'telegram')),
      twitter: z
        .string()
        .optional()
        .transform((val) => (val === '' ? undefined : val))
        .refine(
          (val) => {
            if (!val) return true; // Allow undefined
            const twitterPattern = /^(?:https?:\/\/)?(?:www\.)?(?:x\.com\/|twitter\.com\/|@)?([\w]{1,15})$/;
            return twitterPattern.test(val);
          },
          {
            message:
              'Twitter must be a valid handle (e.g., @username, x.com/username, or https://x.com/username)',
          },
        )
        .transform((val) => normalizeSocialUrl(val, 'twitter')),
    })
    .transform((socials) => ({
      website: socials.website,
      telegram: socials.telegram,
      twitter: socials.twitter,
    })),
});
