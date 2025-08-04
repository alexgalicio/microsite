"use client";

import grapesjs, { Editor } from "grapesjs";
import GjsEditor from "@grapesjs/react";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { toast } from "sonner";

interface DefaultEditorProps {
  siteId: string;
}

export default function DefaultEditor({ siteId }: DefaultEditorProps) {
  const { session } = useSession();

  const onEditor = (editor: Editor) => {
    console.log("Editor loaded", { editor });

    // Load saved data when the editor is initialized
    loadFromSupabase(editor);

    // Add a save button to the editor
    editor.Panels.addButton("options", {
      id: "save-db",
      className: "fa fa-floppy-o",
      command: () => saveToSupabase(editor),
      attributes: { title: "Save to Supabase" },
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
