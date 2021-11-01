import talk from "@/services/talk";

export function listAllTalk() {
  return talk()
    .get(`/room`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function listListedRoom() {
  return talk()
    .get(`/listed-room`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
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

export function SetDescription(token: string, description: string) {
  return talk()
    .put(`/room/${token}/description`, { description })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function postCreateConversation(roomType: number, roomName: string) {
  return talk()
    .post(`/room`, { roomType, roomName })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function postNewParticipant(token: string, newParticipant: string, source: string) {
  return talk()
    .post(`/room/${token}/participants`, { newParticipant, source })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function postPublicConvertion(token: string, state: number) {
  return talk()
    .post(`/room/${token}/public`, { state })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
