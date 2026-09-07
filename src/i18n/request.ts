import { getRequestConfig } from 'next-intl/server';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import ko from '../../messages/ko.json';

const MESSAGE_CATALOGS = { en, es, ko } as const;

export default getRequestConfig(async () => {
  const locale = process.env.NEXT_PUBLIC_APP_LOCALE || 'es';
  const messages = MESSAGE_CATALOGS[locale as keyof typeof MESSAGE_CATALOGS] ?? es;

  return {
    locale,
    messages
  };
});
