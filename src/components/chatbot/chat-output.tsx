import { cn } from "@/lib/utils";
import { Message } from "ai";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveUserFeedback } from "@/lib/actions/chatbot";
import { FeedbackType } from "@/lib/types";
import ReactMarkdown from "react-markdown";

const ChatOutput = ({
  messages,
  status,
}: {
  messages: Message[];
  status: string;
}) => {
  return (
    <>
      {messages.map((message, index) =>
        message.role === "user" ? (
          <UserChat key={index} content={message.content} />
        ) : (
          <AssistantChat key={index} content={message.content} />
        )
      )}
      {status === "submitted" && (
        <div className="text-muted-foreground">Generating response...</div>
      )}
      {status === "error" && (
        <div className="text-red-500">An error occurred.</div>
      )}
    </>
  );
};

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className="bg-muted rounded-lg ml-auto max-w-[80%] w-fit px-3 py-2 rounded-br-none">
      {content}
    </div>
  );
};

const AssistantChat = ({ content }: { content: string }) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const handleFeedback = async (type: FeedbackType) => {
    if (feedback) return;
    setFeedback(type);

    const response = await saveUserFeedback(type);
    if (response.error) {
      console.log("feedback error");
    } else {
      console.log(type);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="pr-8 w-full">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a target="_blank" href={href} className="underline text-primary">
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* feedback button */}
      <div className="flex mt-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={!!feedback}
          onClick={() => handleFeedback("helpful")}
          className={cn(
            feedback === "helpful" ? "text-green-600" : "text-muted-foreground",
            "h-8 w-8"
          )}
        >
          <ThumbsUp size={16} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={!!feedback}
          onClick={() => handleFeedback("unhelpful")}
          className={cn(
            feedback === "unhelpful" ? "text-red-600" : "text-muted-foreground",
            "h-8 w-8"
          )}
        >
          <ThumbsDown size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ChatOutput;
