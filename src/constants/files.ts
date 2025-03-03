import { DEFAULT_SETTINGS } from './settings';

export const DIRECTORIES = ['extensions', 'storage'];

export const WEBUI_PROTOCOL = 'lunarwolf';

export const ERROR_PROTOCOL = 'lunarwolf-error';

export const NETWORK_ERROR_HOST = 'network-error';

export const WEBUI_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4444/'
    : `${WEBUI_PROTOCOL}://`;

export const WEBUI_URL_SUFFIX = WEBUI_BASE_URL.startsWith('http')
  ? '.html'
  : '';

export const FILES = {
  'settings.json': DEFAULT_SETTINGS,
  'window-data.json': {},
};
