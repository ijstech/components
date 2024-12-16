# i18n

The `i18n` class provides internationalization (i18n) support for your application. It allows you to easily manage and switch between different locales, ensuring that your application can cater to users from various linguistic backgrounds.

## Installation

To use i18n, you can import it as follows:

```typescript
import { I18n } from '@ijstech/components';
```

## Usage

### Initializing i18n

To initialize the i18n with translations, use the `init` method. The translations should be provided as an object where each key is a locale and the value is an object containing translation key-value pairs.

```typescript
const i18n = new I18n();
i18n.init({
  'en': {
    'welcome': 'Welcome!',
    'farewell': 'Farewell!'
  },
  'fr': {
    'welcome': 'Bienvenue!',
    'farewell': 'Adieu!'
  }
});
```

### Setting Locale and Retrieving Translations

You can set the current locale by assigning a value to the `locale` property of the `application` object.

```typescript
application.locale = 'en';
console.log(i18n.get('welcome')); // Output: Welcome!

application.locale = 'fr';
console.log(i18n.get('welcome')); // Output: Bienvenue!
```

### Checking for Translation Keys

To check if a translation key exists in the current locale's translations, use the `has` method.

```typescript
const hasWelcome = i18n.has('$welcome');
console.log(hasWelcome); // Output: true or false
```

## API Reference

### `I18n` Class

#### Methods

- **`init(translations: Translations): void`**
  - Initializes the i18n module with the provided translations.
  - **Parameters:**
    - `translations`: An object containing translation key-value pairs.

- **`get(key: string, params?: { [key: string]: string }, skipApp?: boolean): string`**
  - Retrieves a localized string based on the provided key and optional parameters.
  - **Parameters:**
    - `key`: The key for the localized string. If the key starts with '$', it will be processed for localization.
    - `params`: An optional object containing key-value pairs to replace placeholders in the localized string.
    - `skipApp`: An optional boolean to skip checking the application's i18n for the key. Defaults to `false`.
  - **Returns:** The localized string with placeholders replaced by the provided parameters, if any.

- **`has(key: string): boolean`**
  - Checks if a given translation key exists in the current locale's translations.
  - **Parameters:**
    - `key`: The translation key to check, prefixed with a character (e.g., '@key').
  - **Returns:** `true` if the translation key exists in the current locale's translations, otherwise `false`.

### Types

- **`Locales`**
  - A type representing the keys of the `languages` object.

- **`Translations`**
  - A type representing an object where each key is a locale and the value is an object containing translation key-value pairs.

## Example

### Basic Usage

```typescript
import { I18n } from '@ijstech/components';

const i18n = new I18n();
i18n.init({
  'en': {
    'welcome': 'Welcome!',
    'farewell': 'Farewell!'
  },
  'fr': {
    'welcome': 'Bienvenue!',
    'farewell': 'Adieu!'
  }
});

application.locale = 'en';
console.log(i18n.get('$welcome')); // Output: Welcome!

application.locale = 'fr';
console.log(i18n.get('$welcome')); // Output: Bienvenue!
```

### Dynamic Localizing `i-label` Caption

```typescript (samples/dynamic.tsx)
import {Module, Label, application, ComboBox, Locales} from '@ijstech/components';
export default class IButtonExample extends Module{
    private label: Label;
    private cbLocale: ComboBox;

    async init(){
        this.i18n.init({
            'en': {
                'hello': 'Hello',
            },
            'zh-hant': {
                'hello': '你好'
            }
        });
        super.init();
    }
    localeChanged(){
        if (this.cbLocale.selectedItem)
            application.locale = this.cbLocale.selectedItem.value as Locales;
    }
    render(){
        return (
            <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-combo-box id='cbLocale' onChanged={this.localeChanged}>
                    <i-combo-box-item value="en">English</i-combo-box-item>
                    <i-combo-box-item value="zh-hant">繁體中文</i-combo-box-item>
                </i-combo-box>
                <i-label id='label' caption={'$hello'}></i-label>
            </i-panel>
        )
    }
}
```