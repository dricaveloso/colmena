import { UserInvitationInterface, BreadcrumbItemInterface } from "@/interfaces/index";
import { differenceInMinutes } from "date-fns";

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

  const arr = word.split(" ");
  let result = arr[0][0];

  if (arr.length > 1) result += arr[1][0];

  return result.toUpperCase();
}

export function searchByTerm(str: string, word: string): boolean {
  const search = new RegExp(word, "g");
  return str.search(search) !== -1;
}

export const empty = (value: any) => value === null || value === "" || value === undefined;

export function getExtensionFilename(filename: string) {
  if (filename.indexOf(".") < 0) {
    return undefined;
  }

  return filename.substring(filename.lastIndexOf(".") + 1, filename.length);
}

export function generateBreadcrumb(
  path: string | Array<string> | string[] | undefined,
  initialPath: string,
): Array<BreadcrumbItemInterface> {
  const directories: BreadcrumbItemInterface[] = [];
  let breadcrumb = initialPath;

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

export function dateDescription(date: Date | undefined) {
  if (date === undefined) {
    return "";
  }

  const today = new Date();
  const minutes = differenceInMinutes(today, date);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 360);

  if (years > 0) {
    return `${years} ano(s)`;
  }

  if (days > 0) {
    return `${days} dia(s)`;
  }

  if (hours > 0) {
    return `${hours} hora(s)`;
  }

  if (minutes > 1) {
    return `${minutes} minuto(s)`;
  }

  return "Agora";
}
