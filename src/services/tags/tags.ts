// import { ListAllInterface } from "@/interfaces/tags";
import tags from "@/services/tags";
// import axios from "axios";
// import { initializeStore } from "@/store/index";

// export function listAllTags(): ListAllInterface {}

export function createTags() {
  return tags().post("/systemtags", {
    name: "test5API",
    userVisible: "true",
    userAssignable: "true",
  });
}

export function assingTagFile(fileid: number, tagid: number) {
  return tags().put(`/systemtags-relations/files/${fileid}/${tagid}`);
}
export function createAndAssignTags(fileid: number) {
  return tags().post(`/systemtags-relations/files/${fileid}`, {
    name: "test5API",
    userVisible: "true",
    userAssignable: "true",
  });
}
