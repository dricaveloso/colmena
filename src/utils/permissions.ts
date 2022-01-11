import { initializeStore } from "@/store/index";

export function isSubadminProfile() {
  const { media, subadmin } = initializeStore({}).getState().user.user;
  const group = media && Array.isArray(media?.groups) && media?.groups[0] ? media?.groups[0] : "";
  return subadmin.includes(group);
}

export function getUserGroup() {
  const { media } = initializeStore({}).getState().user.user;
  const group = Array.isArray(media?.groups) && media?.groups[0] ? media?.groups[0] : "";
  return group;
}

export function getAllUserGroup() {
  const { media } = initializeStore({}).getState().user.user;
  return media?.groups || [];
}
