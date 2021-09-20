import ocs from "@/services/ocs";

export default function listAllUsers() {
  try {
    return ocs().get(`/capabilities`);
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
