# Tabs Component

The Tabs component now supports custom query parameter names to allow multiple tab instances on the same page to use different URL parameters.

## Basic Usage

```tsx
import { Tabs } from 'shared/ui/tabs';

// Default behavior (uses 'tab_active' query param)
<Tabs
  controllers={[
    { children: 'Tab 1', name: 'first' },
    { children: 'Tab 2', name: 'second' }
  ]}
  contents={[<Content1 />, <Content2 />]}
/>
```

## Custom Query Parameter Names

```tsx
// Chart tabs using 'chart_active' query param
<Tabs
  queryParamName="chart_active"
  controllers={[
    { children: 'Price', name: 'price' },
    { children: 'Volume', name: 'volume' }
  ]}
  contents={[<PriceChart />, <VolumeChart />]}
/>

// Settings tabs using 'settings_active' query param  
<Tabs
  queryParamName="settings_active"
  controllers={[
    { children: 'General', name: 'general' },
    { children: 'Security', name: 'security' }
  ]}
  contents={[<GeneralSettings />, <SecuritySettings />]}
/>
```

## URL Examples

- `?tab_active=first` - Default tab parameter
- `?chart_active=price` - Custom chart tab parameter
- `?settings_active=security` - Custom settings tab parameter

## Controller Properties

Each controller can have a `name` property that will be used in the URL. If no `name` is provided, the `children` text will be used instead.

```tsx
controllers={[
  { children: 'Tab 1', name: 'first' },        // URL: ?param=first
  { children: 'Tab 2' },                        // URL: ?param=Tab%202
  { children: 'Tab 3', name: 'third' }         // URL: ?param=third
]}
```

## Multiple Tabs on Same Page

You can now have multiple tab instances on the same page without conflicts:

```tsx
<div>
  {/* Chart tabs */}
  <Tabs
    queryParamName="chart_active"
    controllers={[...]}
    contents={[...]}
  />
  
  {/* Settings tabs */}
  <Tabs
    queryParamName="settings_active" 
    controllers={[...]}
    contents={[...]}
  />
</div>
```

This will allow URLs like: `?chart_active=price&settings_active=security`
