# Компонент Logo

## Обзор
Компонент для использования логотипа.

## Файлы
- `ui/index.tsx`: Основной файл, в котором определяется компонент Logo.
- `ui/index.stories.tsx`: Истории для компонента Logo, иллюстрирующие различные сценарии использования.
- `ui/style.module.scss`: SCSS-модуль, предоставляющий стили для компонента Logo.
- `ui/assets/*.svg`: SVG иконки.

## Logo Props
- `className` (string): Дополнительный CSS-класс для пользовательской стилизации.
- `size`: Размер иконки (small, full).
- `onClick`?: Функцию, которую вызвать при клике на компонент.

## Использование
```jsx
import { Logo } from 'shared/ui/logo';
<Logo className='some className' size='full'/>
```