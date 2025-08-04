"use client";

import grapesjs, { Editor } from "grapesjs";
import GjsEditor from "@grapesjs/react";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "./styles.css";

interface DefaultEditorProps {
  siteId: string;
}

export default function DefaultEditor({ siteId }: DefaultEditorProps) {
  const { session } = useSession();
  const isMobile = useIsMobile();

  const onEditor = (editor: Editor) => {
    console.log("Editor loaded");

    // load saved data when the editor is initialized
    loadSite(editor);

    // trash button
    editor.Panels.addButton("options", {
      id: "clean-all",
      className: "fa fa-trash",
      command: "clean-all",
      attributes: { title: "Clean All" },
    });

    // clear all button command
    editor.Commands.add("clean-all", {
      run(editor) {
        if (confirm("Are you sure to clean the canvas?")) {
          editor.DomComponents.clear();
          editor.Css.clear();
          editor.select();
        }
      },
    });

    // undo button
    editor.Panels.addButton("options", {
      id: "undo",
      className: "fa fa-undo",
      command: "core:undo",
      attributes: { title: "Undo" },
    });

    // redo button
    editor.Panels.addButton("options", {
      id: "redo",
      className: "fa fa-repeat",
      command: "core:redo",
      attributes: { title: "Redo" },
    });

    // publish button
    editor.Panels.addButton("options", {
      id: "save-db",
      className: "btn-publish",
      label: "Publish",
      command: () => saveSite(editor),
      attributes: { title: "Publish" },
    });

    // move buttom on basic category
    const buttonBlock = editor.BlockManager.get("button");
    if (buttonBlock) {
      buttonBlock.set("category", "Basic");
    }

    // custom heading block
    editor.BlockManager.add(
      "heading",
      {
        label: "Heading",
        content:
          '<h1 data-gjs-type="text">Insert your custom heading here</h1>',
        category: "Basic",
        media:
          '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.3 11.5h7.4V6.9l-.2-1.6a1 1 0 00-.5-.5c-.3-.2-.7-.3-1-.3h-.6v-.4h6.8v.4h-.6c-.4 0-.7.1-1 .3a1 1 0 00-.6.6L18 6.9v10.3c0 .8 0 1.3.2 1.6 0 .2.2.3.4.5.4.2.7.3 1.1.3h.6v.4h-6.8v-.4h.5c.7 0 1.2-.2 1.5-.6.2-.3.3-.9.3-1.8v-4.9H8.3v4.9l.1 1.6.5.5c.3.2.7.3 1 .3h.7v.4H3.7v-.4h.6c.7 0 1.1-.2 1.4-.6.2-.3.3-.9.3-1.8V6.9L6 5.3a1 1 0 00-.5-.5l-1-.3h-.7v-.4h6.9v.4H10c-.4 0-.8.1-1 .3a1 1 0 00-.6.6l-.1 1.5v4.6z"></path></svg>',
      },
      { at: 4 }
    );

    // clickable devices
    editor.getConfig().showDevices = false;
    editor.Panels.addPanel({
      id: "devices",
      buttons: [
        {
          id: "set-device-desktop",
          command: function (e: Editor) {
            return e.setDevice("Desktop");
          },
          className: "fa fa-desktop",
          active: 1,
        },
        {
          id: "set-device-tablet",
          command: function (e: Editor) {
            return e.setDevice("Tablet");
          },
          className: "fa fa-tablet",
        },
        {
          id: "set-device-mobile",
          command: function (e: Editor) {
            return e.setDevice("Mobile portrait");
          },
          className: "fa fa-mobile",
        },
      ],
    });
  };

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      }
    );
  }

  const saveSite = async (editor: Editor) => {
    const htmlContent = editor.getHtml();
    const cssContent = editor.getCss();

    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from("grapesjs")
      .upsert([{ site_id: siteId, html: htmlContent, css: cssContent }]);

    if (error) {
      console.error("Error saving to Supabase:", error);
      toast.error("error");
    } else {
      toast.success("Site saved successfully");
      console.log("Data saved successfully:", data);
    }
  };

  const loadSite = async (editor: Editor) => {
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from("grapesjs")
      .select("html,css")
      .eq("site_id", siteId)
      .single();

    if (error) {
      console.error("Error saving to Supabase:", error);
      toast.error("error");
    } else if (data) {
      editor.setComponents(data.html);
      editor.setStyle(data.css);
      editor.UndoManager.clear();
      console.log("retrieved");
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 px-4 absolute z-[101] top-0 w-screen h-screen items-center justify-center">
        <h1 className="text-2xl text-center">
          Whoops! The Microsite Editor is only available on larger devices.
        </h1>
        <Button asChild variant="link" className="group">
          <Link href="/microsites">
            <ArrowLeft /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: "100vh",
        storageManager: false,
      }}
      plugins={[
        {
          id: "gjs-blocks-basic",
          src: "https://unpkg.com/grapesjs-blocks-basic",
        },
        {
          id: "grapesjs-plugin-forms",
          src: "https://unpkg.com/grapesjs-plugin-forms",
          options: {
            blocks: ["button"],
          },
        },
      ]}
      onEditor={onEditor}
    />
  );
}
