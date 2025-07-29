"use client";

import { useMenu } from "./menu-context";
import { MenuActionDialog } from "./action-dialog";
import { MenuDeleteDialog } from "./delete-dialog";

export function MenuDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMenu();
  return (
    <>
      <MenuActionDialog
        key="menu-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <MenuActionDialog
            key={`menu-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <MenuDeleteDialog
            key={`menu-delete-${currentRow.id}`}
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
