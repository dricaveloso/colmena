import { initializeStore } from "@/store/index";

export function isSubadminProfile() {
  const { media, subadmin } = initializeStore({}).getState().user.user;
  const group = media && Array.isArray(media?.groups) && media?.groups[0] ? media?.groups[0] : "";
  return subadmin.includes(group);
}

export function getUserGroup() {
  const { media } = initializeStore({}).getState().user.user;

  if (!Array.isArray(media?.groups)) return "";

  if (media.groups[0] === "admin") return media.groups[1] ? media.groups[1] : "";

  return media.groups[0];
}

export function getAllUserGroup() {
  const { media } = initializeStore({}).getState().user.user;
  return media?.groups || [];
}
