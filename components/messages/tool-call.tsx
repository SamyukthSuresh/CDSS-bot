import { ToolCallPart, ToolResultPart } from "ai";
import { Book, Globe, Search, Presentation, Wrench, CheckCircle2 } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";

export interface ToolDisplay {
    call_label: string;
    call_icon: React.ReactNode;
    result_label: string;
    result_icon: React.ReactNode;
    formatArgs?: (toolName: string, input: unknown) => string;
};

function formatWebSearchArgs(_: string, input: unknown): string {
    try {
        if (typeof input !== 'object' || input === null) {
            return "";
        }
        const args = input as Record<string, unknown>;
        return args.query ? String(args.query) : "";
    } catch {
        return "";
    }
}

const TOOL_DISPLAY_MAP: Record<string, ToolDisplay> = {
    webSearch: {
        call_label: "Searching the web",
        call_icon: <Search className="w-4 h-4" />,
        result_label: "Searched the web",
        result_icon: <Search className="w-4 h-4" />,
        formatArgs: formatWebSearchArgs,
    },
};

const DEFAULT_TOOL_DISPLAY: ToolDisplay = { call_label: "Using tool", call_icon: <Wrench className="w-4 h-4" />, result_label: "Used tool", result_icon: <Wrench className="w-4 h-4" /> };

function extractToolName(part: ToolCallPart | ToolResultPart): string | undefined {
    const partWithType = part as unknown as { type?: string; toolName?: string };
    if (partWithType.type && partWithType.type.startsWith("tool-")) {
        return partWithType.type.slice(5);
    }
    if (partWithType.toolName) {
        return partWithType.toolName;
    }
    if ('toolName' in part && part.toolName) {
        return part.toolName;
    }
    return undefined;
}

function formatToolArguments(toolName: string, input: unknown, toolDisplay?: ToolDisplay): string {
    if (toolDisplay?.formatArgs) {
        return toolDisplay.formatArgs(toolName, input);
    }

    try {
        if (typeof input !== 'object' || input === null) {
            return String(input);
        }

        const args = input as Record<string, unknown>;
        if (args.query) {
            return String(args.query);
        }
        return "Arguments not available";
    } catch {
        return "Arguments not available";
    }
}

export function ToolCall({ part }: { part: ToolCallPart }) {
    const { input } = part;
    const toolName = extractToolName(part);
    const toolDisplay = toolName ? (TOOL_DISPLAY_MAP[toolName] || DEFAULT_TOOL_DISPLAY) : DEFAULT_TOOL_DISPLAY;
    const formattedArgs = formatToolArguments(toolName || "", input, toolDisplay);

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 animate-fade-in">
            <div className="flex items-center gap-2.5 text-primary shrink-0">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    {toolDisplay.call_icon}
                </div>
                <Shimmer duration={1} className="font-medium text-sm">{toolDisplay.call_label}</Shimmer>
            </div>
            {toolDisplay.formatArgs && formattedArgs && (
                <span className="text-muted-foreground text-sm flex-1 min-w-0 truncate">
                    {formattedArgs}
                </span>
            )}
        </div>
    );
}

export function ToolResult({ part }: { part: ToolResultPart }) {
    const { output } = part;
    const toolName = extractToolName(part);
    const toolDisplay = toolName ? (TOOL_DISPLAY_MAP[toolName] || DEFAULT_TOOL_DISPLAY) : DEFAULT_TOOL_DISPLAY;

    const input = 'input' in part ? part.input : undefined;
    const formattedArgs = input !== undefined ? formatToolArguments(toolName || "", input, toolDisplay) : "";

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-500/5 dark:bg-green-500/10 rounded-xl border border-green-500/20 animate-fade-in">
            <div className="flex items-center gap-2.5 text-green-600 dark:text-green-500 shrink-0">
                <div className="p-1.5 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{toolDisplay.result_label}</span>
            </div>
            {toolDisplay.formatArgs && formattedArgs && (
                <span className="text-muted-foreground text-sm flex-1 min-w-0 truncate">
                    {formattedArgs}
                </span>
            )}
        </div>
    );
}
