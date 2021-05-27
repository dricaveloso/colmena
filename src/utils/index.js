import { SUPPORTED_LANGUAGES, FALLBACK_LANG } from "utils/i18n";
import path from "path";
import fs from "fs";

export function getAllTranslationsByTemplate(template) {
  let result = [];

  SUPPORTED_LANGUAGES.forEach((lang) => {
    const filePath = path.join(
      process.cwd(),
      "src",
      "translations",
      lang,
      `${template}.json`
    );
    let data = fs.readFileSync(filePath);
    data = JSON.parse(data);
    result.push({
      [lang]: {
        [template]: {
          data,
        },
      },
    });
  });

  return result;
}

export function getTranslationByLang(lang, files) {
  let lng = SUPPORTED_LANGUAGES.includes(lang) ? lang : FALLBACK_LANG;

  let result = files.find((value, key) => Object.keys(value) == lang);

  if (!result)
    result = files.find((value, key) => Object.keys(value) === FALLBACK_LANG);

  return {
    t: result[lng],
  };
}
