/* eslint-disable import/no-duplicates */
import { differenceInMinutes, differenceInCalendarMonths, formatDistanceToNow } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import {
  UserInvitationInterface,
  BreadcrumbItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function removeSpecialCharacters(str: string) {
  const withoutAccent = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const withoutSpecial = withoutAccent.replace(/[#,+()$~%'"*!?<>{}]/g, "");
  return withoutSpecial;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function encodeURLAxios(path: string) {
  const contextEncodedArray = path.split("/");
  let filename = contextEncodedArray.pop();
  filename = encodeURIComponent(String(filename));
  contextEncodedArray.push(filename);
  return removeCornerSlash(contextEncodedArray.join("/"));
}

export const isAudioFile = (mime: string | undefined) => {
  if (!mime) return false;

  return /^audio/.test(mime);
};

export const isValidUrl = (url: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

export function parseJwt<Type>(token: string | undefined): Type | undefined {
  if (!token) return undefined;

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c: string) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export function isJWTValidInvitation(tkn: string | string[] | undefined) {
  const token: string | undefined = Array.isArray(tkn) ? tkn[0] : tkn;
  const tokenObj = parseJwt<UserInvitationInterface | undefined>(token);

  const result: {
    valid: boolean;
    token: string | undefined;
  } = {
    valid: false,
    token: undefined,
  };

  if (!token) return result;

  const arrToken = token?.split(".");
  if (arrToken?.length !== 3) {
    return result;
  }

  if (tokenObj) {
    if (!tokenObj?.media || !tokenObj?.username) return result;
  } else return result;

  result.token = token;
  result.valid = true;
  return result;
}

export function getFirstLettersOfTwoFirstNames(word: string | undefined): string {
  if (!word) return "";

  const arr = String(word).split(" ");
  let result = arr[0][0];

  if (arr.length > 2) {
    if (arr[1].length < 4) result += arr[2][0];
    else result += arr[1][0];
  } else if (arr.length === 1) {
    result += arr[0][1];
  }

  return result.toUpperCase();
}

export function getFirstname(word: string | undefined): string {
  if (!word) return "";

  const arr = String(word).split(" ");

  if (arr.length > 1) return capitalizeFirstLetter(arr[0]);

  return capitalizeFirstLetter(word);
}

export function searchByTerm(str: string, word: string): boolean {
  const search = new RegExp(word, "g");
  return str.search(search) !== -1;
}

export const empty = (value: any) => value === null || value === "" || value === undefined;

export function getOnlyFilename(filename: string) {
  if (filename.indexOf(".") < 0) {
    return filename;
  }

  return filename.replace(/(.*)\..+?$/, "$1");
}

export function getExtensionFilename(filename: string) {
  if (filename.indexOf(".") < 0) {
    return undefined;
  }

  return filename.substring(filename.lastIndexOf(".") + 1, filename.length);
}

export function generateBreadcrumb(
  path: string | Array<string> | string[] | undefined,
  initialPath?: string,
): Array<BreadcrumbItemInterface> {
  const directories: BreadcrumbItemInterface[] = [];
  let breadcrumb = initialPath ?? "/";

  if (empty(path)) {
    return directories;
  }

  if (typeof path === "string") {
    breadcrumb += `/${initialPath}/${path}`;
    const directory: BreadcrumbItemInterface = {
      description: path,
      path: breadcrumb,
      isCurrent: true,
    };

    directories.push(directory);

    return directories;
  }

  if (path) {
    path.forEach((dir: string, index) => {
      breadcrumb += `/${dir}`;

      const directory: BreadcrumbItemInterface = {
        description: dir,
        path: breadcrumb,
        isCurrent: index === path?.length - 1,
      };

      directories.push(directory);
    });
  }

  return directories;
}

export function moveScrollToRight(element: any) {
  if (element !== null) {
    const width = element.current.scrollWidth;
    element.current.scrollTo(width, 0);
  }
}

export function dateDescription(date: Date | undefined, timeDescription: TimeDescriptionInterface) {
  if (date === undefined) {
    return "";
  }

  const singularYearDescription = timeDescription.singularYear;
  const pluralYearDescription = timeDescription.pluralYear;
  const singularMonthDescription = timeDescription.singularMonth;
  const pluralMonthDescription = timeDescription.pluralMonth;
  const singularDayDescription = timeDescription.singularDay;
  const pluralDayDescription = timeDescription.pluralDay;
  const singularHourDescription = timeDescription.singularHour;
  const pluralHourDescription = timeDescription.pluralHour;
  const singularMinuteDescription = timeDescription.singularMinute;
  const pluralMinuteDescription = timeDescription.pluralMinute;

  const today = new Date();
  const months = differenceInCalendarMonths(today, date);
  if (months > 0) {
    const monthDescription = months > 1 ? pluralMonthDescription : singularMonthDescription;

    return `${months} ${monthDescription}`;
  }

  const minutes = differenceInMinutes(today, date);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years > 0) {
    const yearDescription = years > 1 ? pluralYearDescription : singularYearDescription;

    return `${years} ${yearDescription}`;
  }

  if (days > 0) {
    const dayDescription = days > 1 ? pluralDayDescription : singularDayDescription;

    return `${days} ${dayDescription}`;
  }

  if (hours > 0) {
    const hourDescription = hours > 1 ? pluralHourDescription : singularHourDescription;

    return `${hours} ${hourDescription}`;
  }

  if (minutes > 1) {
    const minuteDescription = minutes > 1 ? pluralMinuteDescription : singularMinuteDescription;

    return `${minutes} ${minuteDescription}`;
  }

  return timeDescription.now;
}

export function trailingSlash(path: string) {
  return `${removeLastSlash(path)}/`;
}

export function removeFirstSlash(path: string | null | undefined): string {
  if (!path) {
    return "";
  }

  return path.replace(/^[/]*/, "");
}

export function removeLastSlash(path: string | null | undefined): string {
  if (!path) {
    return "";
  }

  return path.replace(/[/]*$/, "");
}

export function removeCornerSlash(path: string | null | undefined): string {
  if (!path) {
    return "";
  }

  return removeFirstSlash(removeLastSlash(path));
}

export function awaiting(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomInt(min: number, max: number) {
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);

  return Math.floor(Math.random() * (intMax - intMin)) + min;
}

export function getFormattedDistanceDateFromNow(timestamp: number, locale = "en") {
  let lce;
  switch (locale) {
    case "en":
      lce = enUS;
      break;
    case "es":
      lce = es;
      break;
    case "fr":
      lce = fr;
      break;
    default:
      lce = enUS;
      break;
  }

  if (!timestamp) return "";

  return formatDistanceToNow(new Date(timestamp * 1000), {
    locale: lce,
  });
}

export function formatCookies(cookies: string[]) {
  if (!cookies || cookies.length === 0) return "";

  const cookiesKeys = cookies
    .map((item: string) => item.split(";")[0])
    .map((item: string) => item.split("=")[0]);

  const cookiesPre = cookies.map((item: string) => item.split(";")[0]).reverse();

  const cookiesMap = new Map();
  cookiesKeys.forEach((element: string) => {
    const value = cookiesPre.find((item: string) => item.indexOf(element) !== -1)?.split("=")[1];
    cookiesMap.set(element, value);
  });

  const cookiesR = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of cookiesMap) {
    cookiesR.push(`${key}=${value}`);
  }

  return cookiesR.join(";");
}

export function downloadFile(data: Blob | null, name = "file", type = "text/plain") {
  if (!data) return false;

  const {
    URL: { createObjectURL, revokeObjectURL },
    setTimeout,
  } = window;

  const blob = new Blob([data], { type });
  const url = createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.setAttribute("href", url);
  anchor.setAttribute("download", name);
  anchor.click();

  setTimeout(() => {
    revokeObjectURL(url);
  }, 100);

  return true;
}

export function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? "0" : ""}`;
  }

  ret += `${mins}:${secs < 10 ? "0" : ""}`;
  ret += `${secs}`;
  return ret;
}

export function uniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
