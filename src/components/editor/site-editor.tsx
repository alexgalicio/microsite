"use client";

import grapesjs, { Editor } from "grapesjs";
import GjsEditor from "@grapesjs/react";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { toast } from "sonner";
import "./styles.css";

interface DefaultEditorProps {
  siteId: string;
}

export default function DefaultEditor({ siteId }: DefaultEditorProps) {
  const { session } = useSession();

  const onEditor = (editor: Editor) => {
    // console.log("Editor loaded", { editor });

    // Load saved data when the editor is initialized
    loadFromSupabase(editor);

    // Add a save button to the editor
    editor.Panels.addButton("options", {
      id: "clean-all",
      className: "fa fa-trash",
      command: "clean-all",
      attributes: { title: "Clean All" },
    });

    // Add Undo button
    editor.Panels.addButton("options", {
      id: "undo",
      className: "fa fa-undo",
      command: "core:undo",
      attributes: { title: "Undo" },
    });

    // Add Redo button
    editor.Panels.addButton("options", {
      id: "redo",
      className: "fa fa-repeat", // or fa-redo if you prefer
      command: "core:redo",
      attributes: { title: "Redo" },
    });

    // Add Clean All button with custom command
    editor.Commands.add("clean-all", {
      run(editor) {
        if (confirm("Are you sure to clean the canvas?")) {
          editor.DomComponents.clear(); // clears all components on canvas
          editor.select();
        }
      },
    });

    editor.Panels.addButton("options", {
      id: "save-db",
      className: "fa fa-floppy-o",
      command: () => saveToSupabase(editor),
      attributes: { title: "Publish" },
    });

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

  const saveToSupabase = async (editor: Editor) => {
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
      toast.success("success");
      console.log("Data saved successfully:", data);
    }
  };

  const loadFromSupabase = async (editor: Editor) => {
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
      ]}
      onEditor={onEditor}
    />
  );
}
