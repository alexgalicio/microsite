import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Codesandbox,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  StrikethroughIcon,
  Type,
  Undo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md p-1 mb-2 space-x-2 z-50">
      {/* Bold */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      {/* Italic */}
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      {/* Paragraph */}
      <Toggle
        size="sm"
        pressed={editor.isActive("paragraph")}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <Type className="h-4 w-4" />
      </Toggle>

      {/* Strike */}
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>

      {/* Code */}
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 className="h-4 w-4" />
      </Toggle>

      {/* Heading 1 */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      {/* Heading 2 */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      {/* Heading 3 */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      {/* Align Left */}
      <Toggle
        size="sm"
        pressed={editor.isActive("textAlign", "left")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>

      {/* Align Center */}
      <Toggle
        size="sm"
        pressed={editor.isActive("textAlign", "center")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>

      {/* Align Right */}
      <Toggle
        size="sm"
        pressed={editor.isActive("textAlign", "right")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      {/* Align Justify */}
      <Toggle
        size="sm"
        pressed={editor.isActive("textAlign", "justify")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("justify").run()
        }
      >
        <AlignJustify className="h-4 w-4" />
      </Toggle>

      {/* Bullet List */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>

      {/* Ordered List */}
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      {/* Code Block */}
      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Codesandbox className="h-4 w-4" />
      </Toggle>

      {/* Blockquote */}
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      {/* Undo */}
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>

      {/* Redo */}
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
