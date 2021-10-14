import talk from "@/services/talk";

export function listAllTalk() {
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
}

export function listEspecificChat(token: string) {
  return talk()
    .get(`/room/${token}`)
    .then((response) => {
      // handle success
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
