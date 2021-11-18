import useTagsFetch from "@/hooks/useTagsFetch";
import { ListAllInterface } from "@/interfaces/tags";
// import tags from "@/services/tags";

export function listAllTags(): ListAllInterface {
  return useTagsFetch("/");
}

// export function createTag(): CreateTagInterface {
//   return tags.put
// }
