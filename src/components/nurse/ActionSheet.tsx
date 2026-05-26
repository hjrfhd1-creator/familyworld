import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * 护士端"页内"底部弹出面板。
 * 不使用全屏遮罩，仅在 480px 小程序框内浮起，
 * 通过寻找最近的 `[data-nurse-frame]` 容器来定位，
 * 这样不会让浏览器外的整个页面置灰。
 */
const ActionSheet = ({ open, onOpenChange, title, description, children, footer }: ActionSheetProps) => {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // next frame -> trigger transition in
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll behind sheet
  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {/* 仅在小程序框内的遮罩 */}
      <div
        onClick={() => onOpenChange(false)}
        className={cn(
          "pointer-events-auto absolute inset-0 bg-foreground/40 transition-opacity duration-200",
          show ? "opacity-100" : "opacity-0",
        )}
      />
      {/* 底部面板 */}
      <div
        className={cn(
          "pointer-events-auto absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-2xl border-t bg-background shadow-2xl transition-transform duration-200 ease-out",
          show ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex h-1 justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex items-start justify-between gap-2 px-5 pb-3 pt-3">
          <div className="min-w-0 flex-1 text-left">
            <h3 className="truncate text-base font-semibold">{title}</h3>
            {description && <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="border-t bg-muted/20 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
};

export default ActionSheet;
