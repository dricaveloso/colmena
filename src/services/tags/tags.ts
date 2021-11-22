// import { ListAllInterface } from "@/interfaces/tags";
import tags from "@/services/tags";
// import axios from "axios";
// import { initializeStore } from "@/store/index";

// export function listAllTags(): ListAllInterface {}

export function createTags() {
  return tags().post("/", {
    name: "test5API",
    userVisible: "true",
    userAssignable: "true",
  });
}
