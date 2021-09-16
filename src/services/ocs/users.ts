import ocs from "@/services/ocs";

export default function listAllUsers() {
  try {
    return ocs().get("/users");
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
