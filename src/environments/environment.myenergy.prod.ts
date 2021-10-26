// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// `.env.ts` is generated by the `npm run env` command
import { myEnergyServices } from './myenergy-services';
import { services } from './services';
export const environment = {
  stroyblockUrl:
    'https://api.storyblok.com/v2/cdn/stories/prod?cv=1634799796&token=b3sqRHiuBmK6Bdu0qlK1zQtt&version=published',
  production: true,
  decimalFormat: '1.2-2',
  integerFormat: '1.0-0',
  defaultPrecision: 2,
  project: 'myenergy',
  version: '1.0.0' + '-dev',
  GTAKey: 'GTM-NZK3T4D',
  serverUrl: 'https://be.circular-iq.com/api',
  serverUrlShort: 'be',
  reportHost: 'https://prod-report-fe.circular-iq.com',
  defaultLanguage: 'English',
  supportedLanguages: ['English'],
  services: services,
  myEnergyServices: myEnergyServices,
};
