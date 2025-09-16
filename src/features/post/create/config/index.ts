import { z } from 'zod';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];

export const POST_CREATE_MODAL_ID = 'POST_CREATE_MODAL_ID';

export const formSchema = z
  .object({
    title: z.string().optional(),
    text: z.string().optional(),
    files: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      // Хотя бы одно поле должно быть заполнено
      const hasTitle = data.title && data.title.trim().length > 0;
      const hasText = data.text && data.text.trim().length > 0;
      const hasFiles = data.files && data.files.length > 0;

      return hasTitle || hasText || hasFiles;
    },
    {
      message: 'At least one field (title, text, or files) must be filled',
      path: ['title'],
    },
  )
  .refine(
    (data) => {
      // Если есть файлы, проверяем их типы
      if (!data.files || data.files.length === 0) return true;

      return data.files.every((file) => ALLOWED_TYPES.includes(file.type));
    },
    {
      message: 'Only image files are allowed (JPEG, PNG, GIF, WebP, BMP, SVG)',
      path: ['files'],
    },
  )
  .refine(
    (data) => {
      // Если есть title или text, они должны быть не пустыми
      if (data.title && data.title.trim().length === 0) return false;
      if (data.text && data.text.trim().length === 0) return false;

      return true;
    },
    {
      message: 'Title and text cannot be empty strings',
      path: ['title'],
    },
  );
