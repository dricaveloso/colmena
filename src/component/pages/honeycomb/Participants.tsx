import { getRoomParticipants } from "@/services/talk/room";
import { RoomParticipant } from "@/interfaces/talk";
import { useTranslation } from "next-i18next";

type Props = {
  token: string;
};

export default function Participants({ token }: Props) {
  const { data } = getRoomParticipants(token, "", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { t } = useTranslation("honeycomb");

  function prepareParticipantsString(data: RoomParticipant[]) {
    const qty = data.length;
    if (qty === 0) return <b>{t("noMemberTitle")}</b>;

    if (qty === 1) return <b>{`1 ${t("member")}`}</b>;

    return <b>{`${qty} ${t("members")}`}</b>;
  }

  return !data ? <b>...</b> : prepareParticipantsString(data.ocs.data);
}
