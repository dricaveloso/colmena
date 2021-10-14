import ocs from "@/services/ocs";

// import ocs from ".";

export default function listAllCapabilities() {
  return ocs()
    .get(`/capabilities`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
