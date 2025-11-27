import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

export function UserMessage({ message }: { message: UIMessage }) {
    return (
        <div className="whitespace-pre-wrap w-full flex justify-end animate-slide-up">
            <div className="max-w-lg w-fit px-5 py-3.5 rounded-2xl rounded-br-md user-bubble-gradient dark:user-bubble-gradient-dark text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
                <div className="text-sm font-medium leading-relaxed">
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
