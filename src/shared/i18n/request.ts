import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

const MESSAGES = { en, ru } as const;

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    return {
        locale,
        messages: MESSAGES[locale],
    };
});
