import React, { useMemo } from "react";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { withStyles, makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { useTranslation } from "next-i18next";
import { formatBytes } from "@/utils/utils";

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

const useStyles = makeStyles(() =>
  createStyles({
    quotaDescription: {
      color: "#666",
      textAlign: "left",
    },
  }),
);
export default function DiscreteSlider() {
  const classes = useStyles();
  const { t } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const quotaDescription = useMemo(() => {
    const totalUsedQuota = userRdx.user.quota.used;
    const totalUsedQuotaFormatted = formatBytes(totalUsedQuota);
    const totalQuota = userRdx.user.quota.total;
    const totaQuotaFormatted = formatBytes(totalQuota);
    const percentage = Math.round((totalUsedQuota / totalQuota) * 100);
    return `${t("used")} ${totalUsedQuotaFormatted} / ${totaQuotaFormatted} (${percentage}%)`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text variant={TextVariantEnum.CAPTION} className={classes.quotaDescription}>
        {quotaDescription}
      </Text>
      <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={Math.round((userRdx.user.quota.used / userRdx.user.quota.total) * 100)}
      />
    </div>
  );
}
