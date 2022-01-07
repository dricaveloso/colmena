import React from "react";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/ui/Loading";
import { useTranslation } from "next-i18next";
import { TagInterface } from "@/interfaces/index";

const caseInsensitiveSort = (rowA: TagInterface, rowB: TagInterface) => {
  const a = rowA.tag.toLowerCase();
  const b = rowB.tag.toLowerCase();

  if (a > b) {
    return 1;
  }

  if (b > a) {
    return -1;
  }

  return 0;
};

type Props = {
  tags: Array<TagInterface>;
  isLoading: boolean;
  deleteTag?: (tag: TagInterface) => void;
  editTag: (tag: TagInterface) => void;
};

export default function TagsListTable({ tags, isLoading, editTag }: Props) {
  const { t } = useTranslation("tags");

  const columns: TableColumn<TagInterface>[] = [
    {
      name: t("table.tagTitle"),
      grow: 1,
      sortable: true,
      sortFunction: caseInsensitiveSort,
      selector: (row) => row.tag,
    },
    {
      name: "",
      width: "100px",
      cell: (tag: TagInterface) => (
        <Box display="flex">
          <IconButton
            key={`edit-${tag.id}`}
            style={{
              backgroundColor: theme.palette.primary.main,
              marginRight: 2,
            }}
            variant="contained"
            icon="edit_text"
            iconColor="#fff"
            size="small"
            fontSizeIcon="small"
            handleClick={() => editTag(tag)}
          />
          {/* <IconButton
            key={`delete-${tag.id}`}
            style={{
              backgroundColor: theme.palette.danger.main,
            }}
            variant="contained"
            icon="trash"
            iconColor="#fff"
            size="small"
            fontSizeIcon="small"
            handleClick={() => deleteTag(tag)}
          /> */}
        </Box>
      ),
    },
  ];

  return (
    <DataTable
      data={tags}
      columns={columns}
      pagination
      paginationPerPage={10}
      progressPending={isLoading}
      progressComponent={<Loading />}
      defaultSortAsc
      defaultSortFieldId={1}
    />
  );
}
