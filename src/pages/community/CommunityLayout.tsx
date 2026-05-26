import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, BookOpen, MessageSquare, ArrowLeft, Bell, Stethoscope } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { to: "/community", icon: Home, label: "工作台", end: true },
  { to: "/community/patients", icon: Users, label: "患者档案" },
  { to: "/community/followup", icon: Stethoscope, label: "随访" },
  { to: "/community/education", icon: BookOpen, label: "宣教" },
  { to: "/community/messages", icon: MessageSquare, label: "沟通" },
];

const titleMap: Record<string, string> = {
  "/community": "工作台",
  "/community/patients": "患者档案",
  "/community/education": "宣教管理",
  "/community/followup": "随访管理",
  "/community/messages": "沟通",
  "/community/refer": "上转鼓楼医院",
};

const CommunityLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFullscreenChild = location.pathname.startsWith("/community/chat");
  const title = titleMap[location.pathname] ?? "工作台";
  const isHome = location.pathname === "/community";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isFullscreenChild && (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3">
          <button
            onClick={() => isHome ? navigate("/") : navigate(-1)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-semibold">{title}</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toast({ title: "您有 4 条新消息", description: "请前往沟通查看" })}
              className="relative rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-community text-xs font-semibold text-primary-foreground">
              张
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto ${isFullscreenChild ? "" : "pb-16"}`}>
        <Outlet />
      </main>

      {!isFullscreenChild && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-md">
          <div className="grid grid-cols-5">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] transition-colors ${
                    isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <t.icon className="h-5 w-5" />
                <span>{t.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="flex justify-center pb-1.5 pt-1">
            <span className="h-1 w-24 rounded-full bg-foreground/40" />
          </div>
        </nav>
      )}
    </div>
  );
};

export default CommunityLayout;
