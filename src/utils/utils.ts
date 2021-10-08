import { UserInvitationInterface, BreadcrumbItemInterface } from "@/interfaces/index";

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

export function createBreadcrumb(
  path: string | Array<string> | string[] | undefined,
): Array<BreadcrumbItemInterface> {
  const directories: BreadcrumbItemInterface[] = [];
  let breadcrumb = "";

  if (empty(path)) {
    return directories;
  }

  if (typeof path === "string") {
    breadcrumb += `/${path}`;
    const directory: BreadcrumbItemInterface = {
      description: path,
      path: breadcrumb,
    };

    directories.push(directory);

    return directories;
  }

  path.forEach((dir: string) => {
    breadcrumb += `/${dir}`;
    const directory: BreadcrumbItemInterface = {
      description: dir,
      path: breadcrumb,
    };

    directories.push(directory);
  });

  return directories;
}
