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

    try {
      // First try to update (assuming record exists)
      const { error: updateError } = await supabase
        .from("grapesjs")
        .update({
          html: htmlContent,
          css: cssContent,
        })
        .eq("site_id", siteId);

      if (!updateError) {
        toast.success("Site updated successfully");
        return;
      }

      // If update fails (likely because record doesn't exist), insert new
      const { error: insertError } = await supabase.from("grapesjs").insert({
        html: htmlContent,
        css: cssContent,
        site_id: siteId,
      });

      if (insertError) {
        throw insertError;
      }

      toast.success("Site created successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save site");
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

    if (data?.grapesjs && data.grapesjs.length > 0) {
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
