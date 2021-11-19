import useCoreFetch from "@/hooks/useCoreFetch";
import { AutocompleteGroupsUsersInterface } from "@/interfaces/ocs";

export function listAutocompleteUsersAndGroups(): AutocompleteGroupsUsersInterface {
  return useCoreFetch(
    "/autocomplete/get?search=&itemType=call&itemId=new&shareTypes[]=0&shareTypes[]=1&shareTypes[]=7&format=json",
  );
}
