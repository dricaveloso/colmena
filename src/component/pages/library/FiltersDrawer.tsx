import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FilterEnum, OrderEnum } from "@/enums/index";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  handleClose: () => void;
  filterItems: (filter: string | FilterEnum) => void;
  orderItems: (order: OrderEnum) => void;
  order: OrderEnum;
  filter: string | FilterEnum;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  active: {
    "& .MuiTypography-root": {
      fontWeight: "bold",
    },
  },
}));

export default function TemporaryFiltersDrawer({
  open,
  filterItems,
  orderItems,
  handleClose,
  order,
  filter,
}: Props) {
  const [expanded, setExpanded] = React.useState<string | boolean>("order");
  const classes = useStyles();
  const { t } = useTranslation("library");

  const handleChange = (panel: string) => (event: any, newExpanded: string | boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const filterActive = useCallback(
    (currentFilter: string | FilterEnum) => (filter === currentFilter ? classes.active : ""),
    [classes.active, filter],
  );
  const orderActive = useCallback(
    (currentOrder: string | OrderEnum) => (order === currentOrder ? classes.active : ""),
    [classes.active, order],
  );

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Accordion expanded={expanded === "order"} onChange={handleChange("order")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="order-content"
          id="order-header"
        >
          <Typography className={classes.heading}>{t("sort.title")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem button key={uuid()} onClick={() => orderItems(OrderEnum.LATEST_FIRST)}>
              <ListItemText
                primary={t("sort.newest")}
                className={orderActive(OrderEnum.LATEST_FIRST)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => orderItems(OrderEnum.OLDEST_FIST)}>
              <ListItemText
                primary={t("sort.oldest")}
                className={orderActive(OrderEnum.OLDEST_FIST)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => orderItems(OrderEnum.ASC_ALPHABETICAL)}>
              <ListItemText
                primary={t("sort.alphabeticalOrder")}
                className={orderActive(OrderEnum.ASC_ALPHABETICAL)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => orderItems(OrderEnum.DESC_ALPHABETICAL)}>
              <ListItemText
                primary={t("sort.descendingAlphabeticalOrder")}
                className={orderActive(OrderEnum.DESC_ALPHABETICAL)}
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === "filter"} onChange={handleChange("filter")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filters-content"
          id="filters-header"
        >
          <Typography className={classes.heading}>{t("filter.title")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem button key={uuid()} onClick={() => filterItems("")}>
              <ListItemText primary={t("filter.all")} className={filterActive("")} />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => filterItems(FilterEnum.OFFLINE)}>
              <ListItemText
                primary={t("filter.availableOffline")}
                className={filterActive(FilterEnum.OFFLINE)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => filterItems(FilterEnum.SYNC)}>
              <ListItemText
                primary={t("filter.synchronized")}
                className={filterActive(FilterEnum.SYNC)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => filterItems(FilterEnum.AUDIO)}>
              <ListItemText
                primary={t("filter.audios")}
                className={filterActive(FilterEnum.AUDIO)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => filterItems(FilterEnum.IMAGE)}>
              <ListItemText
                primary={t("filter.images")}
                className={filterActive(FilterEnum.IMAGE)}
              />
            </ListItem>
            <ListItem button key={uuid()} onClick={() => filterItems(FilterEnum.TEXT)}>
              <ListItemText primary={t("filter.texts")} className={filterActive(FilterEnum.TEXT)} />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
}
