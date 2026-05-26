import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const sessions = [
  { id: 1, kind: "patient" as const, name: "李建国", sub: "兰园社区 · 糖尿病", source: "兰园社区", last: "医生,我空腹血糖又高了。", time: "09:31", unread: 2, abnormal: true },
  { id: 5, kind: "patient" as const, name: "周春华", sub: "兰园社区 · 糖尿病", source: "兰园社区", last: "今天测的血糖给您发过去。", time: "09:10", unread: 1, abnormal: true },
  { id: 4, kind: "doctor" as const, name: "王主任", sub: "南京市鼓楼医院 · 内分泌科", source: "南京市鼓楼医院", last: "陈敏的复诊安排在周三上午。", time: "09:14", unread: 1, abnormal: false },
  { id: 2, kind: "patient" as const, name: "张伟", sub: "南京市鼓楼医院下转 · 2 型糖尿病", source: "南京市鼓楼医院", last: "好的,我按时打胰岛素。", time: "昨日", unread: 0, abnormal: false },
  { id: 3, kind: "patient" as const, name: "刘秀英", sub: "兰园社区 · 桥本甲状腺炎", source: "兰园社区", last: "谢谢张医生。", time: "昨日", unread: 0, abnormal: false },
];

const CommunityMessages = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const list = sessions.filter((s) => !q || s.name.includes(q) || s.sub.includes(q));

  return (
    <div className="space-y-3 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索患者/医生" className="h-9 pl-8 text-sm" />
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y">
          {list.map((s) => (
            <button
              key={`${s.kind}-${s.id}`}
              onClick={() => navigate(`/community/chat/${s.kind}/${s.id}`)}
              className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <div className="relative shrink-0">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${s.kind === "doctor" ? "bg-primary/15 text-primary" : s.abnormal ? "bg-destructive/15 text-destructive" : "bg-accent/15 text-accent"}`}>
                  {s.kind === "doctor" ? <Stethoscope className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                {s.unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {s.unread}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-sm font-semibold">{s.name}</span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${s.source === "南京市鼓楼医院" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {s.source === "南京市鼓楼医院" ? "鼓楼" : "兰园社区"}
                    </span>
                    {s.abnormal && (
                      <span className="shrink-0 rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">异常</span>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{s.time}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{s.sub}</p>
                <p className="mt-0.5 truncate text-xs text-foreground/80">{s.last}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CommunityMessages;
