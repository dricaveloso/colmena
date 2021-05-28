import { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES, FALLBACK_LANG } from "utils/i18n";

function useTranslation(lang, template = "common") {
  const [t, setT] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const langChoosed = SUPPORTED_LANGUAGES.includes(lang)
          ? lang
          : FALLBACK_LANG;
        const t = await import(`translations/${langChoosed}/${template}.json`);
        setT(t.default);
      } catch (e) {
        setT(null);
      }
    })();
  }, [lang, template]);

  return {
    t,
  };
}

export default useTranslation;
