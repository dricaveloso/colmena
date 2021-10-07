import useOcsFetch from "@/hooks/useOcsFetch";
import { GroupsInfoInterface } from "@/interfaces/ocs";

export function listAllGroups(): GroupsInfoInterface {
  return useOcsFetch("/groups");
}
