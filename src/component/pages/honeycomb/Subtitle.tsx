import { getRoomParticipants } from "@/services/talk/room";
import { useTranslation } from "next-i18next";

type Props = {
  token: string;
};

export default function Subtitle({ token }: Props) {
  const { t } = useTranslation("honeycomb");
  const { data } = getRoomParticipants(token, "", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  function prepareParticipantsString(qty: number) {
    if (qty === 0) return t("noMemberTitle");

    if (qty === 1) return `1 ${t("member")}`;

    return `${qty} ${t("members")}`;
  }

  return <span>{!data ? "..." : prepareParticipantsString(data.ocs.data.length)}</span>;
}
