import { cn } from "@/lib/utils";
import { Message } from "ai";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveUserFeedback } from "@/lib/actions/chatbot";
import { FeedbackType } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

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
        <div className="flex gap-2 items-end">
          <Image
            src="/images/foxy.svg"
            alt="Foxy"
            width={44}
            height={44}
            className="object-contain"
          />
          <div className="flex space-x-1 bg-muted rounded-lg px-3 py-2 rounded-bl-none">
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="text-red-500 text-sm">An error occurred.</div>
      )}
    </>
  );
};

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className="bg-primary text-primary-foreground rounded-lg ml-auto w-fit px-3 py-2 rounded-br-none text-sm">
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
      <div className="flex items-start gap-2">
        <Image
          src="/images/foxy.svg"
          alt="Foxy"
          width={44}
          height={44}
          className="object-contain"
        />
        <div>
          <div className="bg-muted rounded-lg px-3 py-2 rounded-bl-none w-fit text-sm">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    target="_blank"
                    href={href}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          <div className="flex mt-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!!feedback}
              onClick={() => handleFeedback("helpful")}
              className={cn(
                feedback === "helpful"
                  ? "text-green-600"
                  : "text-muted-foreground",
                "h-6 w-6"
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
                feedback === "unhelpful"
                  ? "text-red-600"
                  : "text-muted-foreground",
                "h-6 w-6"
              )}
            >
              <ThumbsDown size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOutput;
