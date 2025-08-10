"use client";

import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor, EditorContent } from "@tiptap/react";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";

export default function RichTextEditor({
  content,
  onChange,
  editable,
}: {
  content: string;
  onChange?: (richText: string) => void;
  editable?: boolean;
}) {
  const isEditable = editable ?? true;
  const editor = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextStyleKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https", "ftp", "mailto"],
        HTMLAttributes: {
          class: "text-blue-500 cursor-pointer hover:underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    shouldRerenderOnTransaction: true,
    content: content,
    editorProps: {
      attributes: {
        class: isEditable ? "min-h-[156px] border rounded-md py-2 px-3" : "",
      },
    },
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    },

    immediatelyRender: false,
  });

  return (
    <div>
      {isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
