import { ReactNode } from "react";

interface EditorLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function EditorLayout({ leftPanel, rightPanel }: EditorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,480px] gap-6 lg:gap-8">
          {/* Left Panel - Preview & Status */}
          <div className="space-y-6 order-2 lg:order-1">
            {leftPanel}
          </div>

          {/* Right Panel - Config (Sticky) */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-hidden">
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
