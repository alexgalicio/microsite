"use client";

import { SiteActionDialog } from "./action-dialog";
import { useSite } from "./site-context";

export function SiteDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSite();
  return (
    <>
      <SiteActionDialog
        key="site-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <SiteActionDialog
            key={`site-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
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
