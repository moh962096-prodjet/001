export * from "./router.tsx";
import { DEFAULT_LOCALE, isLocale } from "../i18n/config";

export function getLocaleFromPath(pathname: string) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}
