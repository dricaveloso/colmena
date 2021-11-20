import { ListAllInterface } from "@/interfaces/tags";
import tags from "@/services/tags";

export function listAllTags(): ListAllInterface {
  return tags().PROPFIND("/");
}

// export function createTag(): CreateTagInterface {
//   return tags.put
// }
