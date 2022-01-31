import React from "react";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { useTranslation } from "next-i18next";

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 4,
    borderRadius: 5,
    marginTop: 8,
  },
  bar: {
    borderRadius: 5,
  },
}))(LinearProgress);

export default function DiscreteSlider() {
  const { t } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <div>
      <Text variant={TextVariantEnum.CAPTION} style={{ color: "#666" }}>
        {t("used")}
        <> {(userRdx.user.quota.used / (1000 * 1000 * 1000)).toFixed(2)} GB </>
        {`(${Math.round((userRdx.user.quota.used / userRdx.user.quota.total) * 100)}%)`}
      </Text>
      <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={Math.round((userRdx.user.quota.used / userRdx.user.quota.total) * 100)}
      />
    </div>
  );
}
