"use client";

import { useSubmenu } from "./submenu-context";
import { SubmenuActionDialog } from "./edit-dialog";
import { SubmenuDeleteDialog } from "./delete-dialog";

export function SubmenuDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSubmenu();
  return (
    <>
      {currentRow && (
        <>
          <SubmenuActionDialog
            key={`submenu-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <SubmenuDeleteDialog
            key={`submenu-delete-${currentRow.id}`}
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
