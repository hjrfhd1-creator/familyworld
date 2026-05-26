import { Wallet, TrendingUp, Award, ClipboardCheck, BookOpen, LogOut as LogOutIcon, Settings, ChevronRight, Activity, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const weekly = [
  { d: "周一", v: 38 }, { d: "周二", v: 52 }, { d: "周三", v: 41 }, { d: "周四", v: 60 },
  { d: "周五", v: 48 }, { d: "周六", v: 35 }, { d: "今日", v: 28 },
];

const NurseProfile = () => {
  const navigate = useNavigate();
  const max = Math.max(...weekly.map((w) => w.v));

  return (
    <div className="space-y-3 p-4">
      {/* 个人信息 */}
      <Card className="bg-gradient-nurse p-4 text-primary-foreground shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold">李</div>
          <div className="flex-1">
            <p className="text-base font-semibold">李护士</p>
            <p className="mt-0.5 text-[11px] opacity-90">心内科 · 主管护师 · 工号 N0312</p>
          </div>
          <button onClick={() => toast({ title: "设置" })} className="rounded-full p-1.5 hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/20 pt-3 text-center">
          <div>
            <p className="text-[10px] opacity-80">服务患者</p>
            <p className="mt-0.5 text-base font-bold">42</p>
          </div>
          <div>
            <p className="text-[10px] opacity-80">本月工时</p>
            <p className="mt-0.5 text-base font-bold">168h</p>
          </div>
          <div>
            <p className="text-[10px] opacity-80">好评率</p>
            <p className="mt-0.5 text-base font-bold">98%</p>
          </div>
        </div>
      </Card>

      {/* 收益概览 */}
      <Card className="bg-gradient-card p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold">本月收益</h3>
          </div>
          <button onClick={() => toast({ title: "收益明细" })} className="flex items-center text-[11px] text-muted-foreground">
            明细 <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <p className="text-3xl font-bold">¥ 8,640.00</p>
        <p className="mt-1 text-[11px] text-success">+12% 较上月</p>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">完成单数</p>
            <p className="mt-0.5 text-lg font-bold text-primary">86</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">待结算</p>
            <p className="mt-0.5 text-lg font-bold text-warning">¥ 1,280</p>
          </div>
        </div>
      </Card>

      {/* 工作量图表 */}
      <Card className="p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">本周工作量</h3>
          </div>
          <span className="text-[11px] text-muted-foreground">护理任务 / 天</span>
        </div>
        <div className="flex h-28 items-end gap-2">
          {weekly.map((w) => (
            <div key={w.d} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-gradient-nurse transition-all"
                  style={{ height: `${(w.v / max) * 100}%` }}
                  title={`${w.v} 单`}
                />
              </div>
              <span className="text-[9px] text-muted-foreground">{w.d}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
          {[
            { label: "本周总单", value: 302, color: "text-primary" },
            { label: "异常处置", value: 18, color: "text-destructive" },
            { label: "宣教完成", value: 56, color: "text-accent" },
          ].map((s) => (
            <div key={s.label}>
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 工作类型分布 */}
      <Card className="p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold">工作类型分布</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: "体征监测", v: 42, color: "bg-primary" },
            { label: "服药管理", v: 28, color: "bg-accent" },
            { label: "宣教推送", v: 18, color: "bg-warning" },
            { label: "出院交接", v: 12, color: "bg-success" },
          ].map((it) => (
            <div key={it.label}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span>{it.label}</span>
                <span className="font-semibold">{it.v}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${it.color}`} style={{ width: `${it.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 快捷入口 */}
      <Card className="overflow-hidden">
        <div className="divide-y">
          {[
            { label: "出院转交", icon: LogOutIcon, to: "/nurse/handover" },
            { label: "宣教管理", icon: BookOpen, to: "/nurse/education" },
            { label: "成就徽章", icon: Award, badge: "新", action: () => toast({ title: "您已获得 8 枚徽章" }) },
            { label: "排班日历", icon: Calendar, action: () => toast({ title: "排班" }) },
          ].map((m) => (
            <button
              key={m.label}
              onClick={() => (m.to ? navigate(m.to) : m.action?.())}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <m.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{m.label}</span>
              {m.badge && <Badge variant="secondary" className="h-4 text-[10px]">{m.badge}</Badge>}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NurseProfile;
