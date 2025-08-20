"use client";

import { LinkActionDialog } from "./action-dialog";
import { LinkDeleteDialog } from "./delete-dialog";
import { useLink } from "./link-context";

export function LinkDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLink();
  return (
    <>
      <LinkActionDialog
        key="link-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <LinkActionDialog
            key={`link-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <LinkDeleteDialog
            key={`link-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
