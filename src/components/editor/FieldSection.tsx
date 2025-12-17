import { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FieldSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  tooltip?: string;
  children: ReactNode;
}

export function FieldSection({ title, description, icon, tooltip, children }: FieldSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground -mt-1">{description}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface FieldRowProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FieldRow({ label, htmlFor, required, hint, error, children }: FieldRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[10px] text-destructive">{error}</p>}
    </div>
  );
}
