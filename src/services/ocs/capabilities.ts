import ocs from "@/services/ocs";

// import ocs from ".";

export default function listAllCapabilities() {
  try {
    return ocs()
      .get(`/capabilities`)
      .then((response) => {
        // handle success
        console.log(response);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
