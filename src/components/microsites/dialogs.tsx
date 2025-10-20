"use client";

import { SiteActionDialog } from "./action-dialog";
import { ArchiveSiteDialog } from "./archive-site";
import { PublishSiteDialog } from "./publish-dialog";
import { UnpublishSiteDialog } from "./unpublish-site";
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

          <UnpublishSiteDialog
            key={`site-unpublish-${currentRow.id}`}
            open={open === "unpublish"}
            onOpenChange={() => {
              setOpen("unpublish");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <PublishSiteDialog
            key={`site-publish-${currentRow.id}`}
            open={open === "publish"}
            onOpenChange={() => {
              setOpen("publish");
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
