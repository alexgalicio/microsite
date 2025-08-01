"use client";

import { SiteActionDialog } from "./action-dialog";
import { ArchiveSiteDialog } from "./archive-site";
import { RestoreSiteDialog } from "./restore-dialog";
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

          <ArchiveSiteDialog
            key={`site-archive-${currentRow.id}`}
            open={open === "archive"}
            onOpenChange={() => {
              setOpen("archive");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <RestoreSiteDialog
            key={`site-restore-${currentRow.id}`}
            open={open === "restore"}
            onOpenChange={() => {
              setOpen("restore");
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
