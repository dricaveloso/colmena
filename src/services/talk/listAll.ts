import talk from "@/services/talk";

export default function listAllTalk() {
  try {
    return talk()
      .get(`/room`)
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
