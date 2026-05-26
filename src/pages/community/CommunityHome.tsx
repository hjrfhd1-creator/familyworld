import { useNavigate } from "react-router-dom";
import { Users, BookOpen, MessageSquare, AlertTriangle, Activity, ClipboardCheck, ChevronRight, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const CommunityHome = () => {
  const navigate = useNavigate();

  const todoItems = [
    {
      key: "patients", icon: Users, label: "患者档案", sub: "在管 · 兰园社区",
      count: 128, unit: "在管", color: "text-primary", bg: "bg-primary/10",
      to: "/community/patients",
    },
    {
      key: "education", icon: BookOpen, label: "宣教", sub: "糖尿病/甲状腺管理",
      count: 6, unit: "条待推送", color: "text-warning", bg: "bg-warning/10",
      to: "/community/education",
    },
    {
      key: "chat", icon: MessageSquare, label: "沟通", sub: "患者/上级医生",
      count: 4, unit: "条未读", color: "text-success", bg: "bg-success/10",
      to: "/community/messages",
    },
    {
      key: "abnormal", icon: AlertTriangle, label: "异常", sub: "异常患者待处置",
      count: 2, unit: "位异常", color: "text-destructive", bg: "bg-destructive/10",
      to: "/community/patients?tab=abnormal",
    },
    {
      key: "followup", icon: Stethoscope, label: "随访", sub: "术后/慢病随访",
      count: 4, unit: "位待随访", color: "text-warning", bg: "bg-warning/10",
      to: "/community/followup",
    },
  ];

  const total = todoItems.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-3 p-4">
      <Card className="bg-gradient-community p-4 text-primary-foreground shadow-soft">
        <h2 className="text-base font-semibold">张医生,早上好 👋</h2>
        <p className="mt-0.5 text-[11px] opacity-90">兰园社区卫生站 · 对接南京市鼓楼医院 · 内分泌科</p>
      </Card>

      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold">今日待办</h3>
        </div>
        <Badge variant="secondary" className="h-5">共 {total} 项</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {todoItems.map((t) => (
          <button
            key={t.key}
            onClick={() => navigate(t.to)}
            className="group relative flex items-center justify-between rounded-2xl border bg-card p-3.5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${t.bg}`}>
                <t.icon className={`h-5 w-5 ${t.color}`} />
              </div>
              <p className="text-[13px] font-medium text-foreground">{t.label}</p>
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{t.sub}</p>
            </div>
            <div className="ml-2 flex shrink-0 flex-col items-end">
              <span className={`text-2xl font-bold leading-none ${t.color}`}>{t.count}</span>
              <span className="mt-1 text-[10px] text-muted-foreground">{t.unit}</span>
            </div>
          </button>
        ))}
      </div>

      {(() => {
        const tasks = [
          { patientId: 4, type: "宣教", priority: "紧急", bed: "—", name: "陈敏", sub: "糖尿病饮食指南 · 09:00" },
          { patientId: 2, type: "沟通", priority: "紧急", bed: "—", name: "李娜", sub: "回复胰岛素用药咨询 · 10:00" },
          { patientId: 11, type: "随访", priority: "紧急", bed: "—", name: "韩启航", sub: "出院第 3 天血糖随访 · 10:30" },
          { patientId: 3, type: "宣教", priority: "重要", bed: "—", name: "王强", sub: "甲亢低碘饮食宣教 · 11:00" },
          { patientId: 1, type: "沟通", priority: "重要", bed: "—", name: "张伟", sub: "回访 7 日血糖记录 · 13:30" },
          { patientId: 12, type: "随访", priority: "重要", bed: "—", name: "王晓彤", sub: "甲亢复诊 TSH 评估 · 14:30" },
          { patientId: 4, type: "转诊", priority: "普通", bed: "—", name: "陈敏", sub: "上转鼓楼医院 · 内分泌科 · 14:00" },
          { patientId: 6, type: "转诊", priority: "普通", bed: "—", name: "周婷", sub: "上转鼓楼医院 · 内分泌科 · 16:00" },
        ];
        const typeStyle: Record<string, string> = {
          "宣教": "bg-accent/10 text-accent",
          "沟通": "bg-primary/10 text-primary",
          "随访": "bg-warning/15 text-warning",
          "转诊": "bg-success/10 text-success",
        };
        const priorityStyle: Record<string, string> = {
          "紧急": "bg-destructive/10 text-destructive",
          "重要": "bg-warning/15 text-warning",
          "普通": "bg-muted text-muted-foreground",
        };
        const handleClick = (t: typeof tasks[number]) => {
          if (t.type === "沟通" || t.type === "随访") navigate(`/community/chat/patient/${t.patientId}`);
          else if (t.type === "宣教") navigate(`/community/education`);
          else if (t.type === "转诊") {
            toast({ title: "已发起转诊", description: "正在跳转至鼓楼医院互联网医院..." });
            setTimeout(() => window.open("https://www.njglyy.com/", "_blank"), 600);
          }
        };
        return (
          <>
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold">今日待办清单</h3>
              </div>
              <span className="text-[10px] text-muted-foreground">共 {tasks.length} 项 · 按优先级</span>
            </div>
            <Card className="overflow-hidden">
              <div className="divide-y">
                {tasks.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleClick(t)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeStyle[t.type]}`}>
                          {t.type}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${priorityStyle[t.priority]}`}>
                          {t.priority}
                        </span>
                        <span className="text-[13px] font-semibold">{t.name}</span>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">{t.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Card>
          </>
        );
      })()}
    </div>
  );
};

export default CommunityHome;
