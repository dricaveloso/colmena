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
export function listOpenChat() {
  return talk()
    .get(`/listed-room`)
    .then((response) => {
      // handle success
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
export function SetROChat(token: string) {
  return talk()
    .put(`/room/${token}/read-only`)
    .then((response) => {
      // handle success
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
export function participants(token: string) {
  return talk()
    .get(`/room/${token}/participants`)
    .then((response) => {
      // handle success
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
