import { BearMascot } from "@/components/bears/BearMascot";
import type { ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** One message in the tutor conversation. */
export function ChatBubble({ message }: { message: ChatMessage }) {
  const isBear = message.role === "bear";

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2",
        isBear ? "justify-start" : "justify-end",
      )}
    >
      {isBear && (
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-low shadow-sm sm:flex">
          <BearMascot variant="panda" size={38} withPlate={false} />
        </div>
      )}

      <div className={cn("flex max-w-[78%] flex-col gap-1", !isBear && "items-end")}>
        <div
          className={cn(
            "px-space-md py-3 font-body-md text-body-md leading-relaxed shadow-sm",
            isBear
              ? "rounded-2xl rounded-bl-sm bg-surface-container-lowest text-on-surface"
              : "rounded-2xl rounded-br-sm bg-primary-container text-on-primary-container",
          )}
        >
          {message.text}
        </div>

        {message.sources && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-label-badge text-label-badge text-on-surface-variant">
              📌 From your notes:
            </span>
            {message.sources.map((source) => (
              <span
                key={source}
                className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-badge text-label-badge text-on-surface-variant"
              >
                {source}
              </span>
            ))}
          </div>
        )}

        <span className="px-1 font-label-badge text-label-badge text-on-surface-variant">
          {message.time}
        </span>
      </div>

      {!isBear && (
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-body-sm text-body-sm font-bold text-on-primary sm:flex">
          Me
        </div>
      )}
    </div>
  );
}

/** Three bouncing dots shown while Panda "thinks". */
export function TypingBubble() {
  return (
    <div className="flex w-full items-end gap-2">
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-low shadow-sm sm:flex">
        <BearMascot variant="panda" size={38} withPlate={false} animated />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-surface-container-lowest px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-2 w-2 animate-typing-dot rounded-full bg-primary-container"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
