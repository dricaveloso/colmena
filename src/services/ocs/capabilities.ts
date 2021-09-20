import ocs from "@/services/ocs";

export default function listAllUsers() {
  try {
    return ocs().get(
      `https://cors-anywhere.herokuapp.com/https://claudio.colmena.network/ocs/v2.php/cloud/capabilities`,
    );
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
