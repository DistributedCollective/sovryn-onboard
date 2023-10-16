import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import merge from 'lodash.merge';
import { initReactI18next } from 'react-i18next';

import type { i18nOptions } from '../types.js';
import en from './en.json';

export const languageLocalStorageKey = 'i18nextLng_dapp';

export default function initialize(options?: i18nOptions): void {
  const translationsJson: any = {
    en: {
      translation: merge(en, options?.en || {}),
    },
  };

  if (options) {
    const customLocales = Object.keys(options).filter(key => key !== 'en');

    customLocales.forEach(locale => {
      translationsJson[locale] = { translation: options[locale] };
    });
  }

  const languages = Object.keys(translationsJson);

  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init(
      {
        resources: translationsJson,
        react: {
          useSuspense: true,
        },
        fallbackLng: 'en',
        supportedLngs: languages,
        detection: {
          order: ['localStorage', 'navigator'],
          // needs to be different from default to prevent overwrite by @sovryn/react-wallet
          lookupLocalStorage: languageLocalStorageKey,
          // don't cache automatically into localStorage only on manual language change
          caches: [],
          excludeCacheFor: ['cimode'],
        },
      },
      error => {
        if (error) {
          console.error(error);
        }
      },
    );
}

export function changeLanguage(lng: string) {
  i18next.changeLanguage(lng);
}
