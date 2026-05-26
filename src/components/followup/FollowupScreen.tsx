import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { followupList, followupStats, FollowupStatus } from "@/data/followup";

const statusStyle: Record<FollowupStatus, string> = {
  "待随访": "bg-primary/10 text-primary",
  "需复访": "bg-warning/15 text-warning",
  "已完成": "bg-success/10 text-success",
};

type Props = {
  chatBase: string; // e.g. "/nurse/chat/patient" or "/community/chat/patient"
  gradientClass?: string; // banner gradient
  accentText?: string; // text-primary | text-accent
};

const FollowupScreen = ({ chatBase, gradientClass = "bg-gradient-nurse", accentText = "text-primary" }: Props) => {
  const navigate = useNavigate();
  const stats = followupStats();

  return (
    <div className="space-y-3 p-4">
      <Card className={`${gradientClass} p-4 text-primary-foreground shadow-soft`}>
        <button
          onClick={() => toast({ title: "AI 随访清单已生成", description: "已根据术后天数与风险等级排序" })}
          className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          打开 AI 随访清单
        </button>
        <p className="mt-3 text-[11px] opacity-90">智能识别需随访患者 · 按术后天数与风险排序</p>
      </Card>

      <Card className="p-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <h3 className="text-sm font-semibold">随访进度</h3>
          <span className="text-[11px] text-muted-foreground">共 {stats.total} 例</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "待随访", value: stats.pending, color: accentText },
            { label: "需复访", value: stats.recheck, color: "text-warning" },
            { label: "已完成", value: stats.done, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/50 py-3 text-center">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">随访患者</h3>
          <span className="text-[11px] text-muted-foreground">按术后天数</span>
        </div>
        <div className="divide-y">
          {followupList.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`${chatBase}/${p.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${accentText} bg-primary/10`}>
                {p.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusStyle[p.status]}`}>
                    {p.status}
                  </span>
                  {p.postOpDay != null && (
                    <span className="text-[10px] text-muted-foreground">术后 {p.postOpDay} 天</span>
                  )}
                </div>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{p.surgery}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FollowupScreen;
