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

    const { data: existing } = await supabase
      .from("grapesjs")
      .select("id")
      .eq("site_id", siteId)
      .single();

    // Use upsert to insert or update the record
    const { data, error } = await supabase.from("grapesjs").upsert({
      id: existing?.id, // Will be undefined for new records
      site_id: siteId,
      html: htmlContent,
      css: cssContent,
    });

    if (error) {
      console.error("Error saving to Supabase:", error);
    } else {
      console.log("Content saved/updated successfully:", data);
    }
  };

  const loadFromSupabase = async (editor: Editor) => {
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from("sites")
      .select(
        `
        id,
        grapesjs (
            html,
            css
        )
    `
      )
      .eq("id", siteId)
      .single();

    if (error) {
      console.error("Error loading from Supabase:", error);
    }

    if (data?.grapesjs) {
      // Set the HTML and CSS in the editor
      editor.setComponents(data.grapesjs[0].html);
      editor.setStyle(data.grapesjs[0].css);
      console.log("Data loaded successfully:", data);
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
