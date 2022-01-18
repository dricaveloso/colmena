import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useTranslation } from "next-i18next";

const useStyles = makeStyles({
  table: {
    minWidth: "100%",
    marginTop: 35,
  },
});

type Props = {
  data: {
    browser: string;
    version: number | string;
    compatible: boolean;
  }[];
};

export default function BrowsersList({ data }: Props) {
  const { t } = useTranslation("install");
  const classes = useStyles();

  return (
    <TableContainer>
      <Table size="small" className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow style={{ background: "#fff" }}>
            <TableCell style={{ fontWeight: "bold" }}>{t("browserCompatibility")}</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              {t("minimumVersionBrowserCompatibility")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.browser}
              style={{ backgroundColor: row.compatible ? "#D0F1DE" : "#F8C9CA" }}
            >
              <TableCell component="th" scope="row">
                {row.browser}
              </TableCell>
              <TableCell align="right">{row.version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
