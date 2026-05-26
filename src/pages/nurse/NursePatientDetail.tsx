import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, Phone, Users as UsersIcon, FileText,
  ChevronDown, CheckCircle2, Stethoscope, TrendingUp, Activity, BookOpen, Send,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";
import { eduByCategory } from "@/data/education";

type Med = { name: string; freq: string; per: string; start: string; end: string; days: number; ended?: boolean };
type Health = { label: string; value: string; unit: string; status: "正常" | "偏高" | "偏低" };
type Patient = {
  id: number;
  name: string;
  bed: string;
  age: number;
  gender: "男" | "女";
  idCard: string;
  phone: string;
  vip?: boolean;
  diagnosis: string;
  condition: string;
  doctor: string;
  updatedAt: string;
  healthSummary: string;
  health: Health[];
  meds: Med[];
  trend: { label: string; unit: string; range: string; points: { date: string; v: number }[] }[];
  lifestyle: { label: string; tone: "good" | "warn" }[];
};

const patients: Record<string, Patient> = {
  "1": {
    id: 1, name: "张伟", bed: "0312", age: 58, gender: "男",
    idCard: "3201**********0318", phone: "13851234567", vip: true,
    diagnosis: "2 型糖尿病 · 酮症倾向", condition: "糖尿病", doctor: "王主任",
    updatedAt: "2026年04月16日 15:24:47",
    healthSummary: "近期血糖波动较大,需加强监测",
    health: [
      { label: "餐后2小时血糖", value: "16.8", unit: "mmol/L", status: "偏高" },
      { label: "空腹血糖", value: "9.6", unit: "mmol/L", status: "偏高" },
      { label: "糖化血红蛋白", value: "9.2", unit: "%", status: "偏高" },
      { label: "体重", value: "72", unit: "kg", status: "正常" },
    ],
    meds: [
      { name: "门冬胰岛素", freq: "每天3次", per: "8U", start: "2026-04-10", end: "2026-05-10", days: 6 },
      { name: "二甲双胍片", freq: "每天3次", per: "0.5g", start: "2026-04-10", end: "2026-05-10", days: 6 },
      { name: "阿托伐他汀", freq: "每天1次", per: "1片", start: "2026-03-30", end: "2026-04-29", days: 30, ended: true },
    ],
    trend: [
      { label: "餐后2小时血糖", unit: "mmol/L", range: "4.4 ~ 7.8",
        points: [{ date: "04-10", v: 14.2 }, { date: "04-14", v: 16.5 }, { date: "04-18", v: 15.1 }, { date: "04-22", v: 17.2 }, { date: "04-26", v: 16.8 }] },
      { label: "空腹血糖", unit: "mmol/L", range: "3.9 ~ 6.1",
        points: [{ date: "04-10", v: 8.4 }, { date: "04-14", v: 9.1 }, { date: "04-18", v: 8.8 }, { date: "04-22", v: 9.6 }, { date: "04-26", v: 9.2 }] },
    ],
    lifestyle: [
      { label: "低糖饮食", tone: "good" },
      { label: "规律运动", tone: "warn" },
      { label: "戒烟", tone: "good" },
      { label: "睡眠不足", tone: "warn" },
    ],
  },
  "2": {
    id: 2, name: "李娜", bed: "0508", age: 45, gender: "女",
    idCard: "3201**********0426", phone: "18694990314", vip: true,
    diagnosis: "2 型糖尿病 · 周围神经病变", condition: "糖尿病", doctor: "李医生",
    updatedAt: "2026年04月16日 15:24:47",
    healthSummary: "血糖控制趋稳,继续维持当前方案",
    health: [
      { label: "餐后2小时血糖", value: "7.2", unit: "mmol/L", status: "正常" },
      { label: "体重", value: "60", unit: "kg", status: "正常" },
      { label: "糖化血红蛋白", value: "8.0", unit: "%", status: "偏高" },
      { label: "空腹血糖", value: "5.5", unit: "mmol/L", status: "正常" },
    ],
    meds: [
      { name: "甘精胰岛素", freq: "每天1次", per: "16U", start: "2026-04-30", end: "2026-05-29", days: 4 },
      { name: "甲钴胺片", freq: "每天3次", per: "0.5mg", start: "2026-04-30", end: "2026-05-29", days: 4 },
      { name: "阿托伐他汀", freq: "每天1次", per: "1片", start: "2026-03-30", end: "2026-04-29", days: 4, ended: true },
    ],
    trend: [
      { label: "餐后2小时血糖", unit: "mmol/L", range: "4.4 ~ 7.8",
        points: [{ date: "2026-04-10", v: 7.4 }, { date: "2026-04-30", v: 8.0 }] },
      { label: "空腹血糖", unit: "mmol/L", range: "3.9 ~ 6.1",
        points: [{ date: "2026-04-10", v: 5.8 }, { date: "2026-04-30", v: 5.5 }] },
    ],
    lifestyle: [
      { label: "低糖饮食", tone: "good" },
      { label: "规律运动", tone: "good" },
      { label: "睡眠良好", tone: "good" },
      { label: "情绪稳定", tone: "good" },
    ],
  },
};

const fallback = (id: string): Patient => ({
  id: Number(id), name: "患者", bed: "—", age: 0, gender: "男",
  idCard: "—", phone: "—",
  diagnosis: "—", condition: "—", doctor: "—",
  updatedAt: "—", healthSummary: "暂无健康摘要",
  health: [], meds: [],
  trend: [{ label: "餐后2小时血糖", unit: "mmol/L", range: "4.4 ~ 7.8", points: [] }],
  lifestyle: [],
});

const TrendChart = ({ points, range }: { points: { date: string; v: number }[]; range: string }) => {
  if (points.length === 0) return <div className="py-8 text-center text-xs text-muted-foreground">暂无数据</div>;
  const w = 320, h = 160, pad = 28;
  const vals = points.map((p) => p.v);
  const max = Math.max(...vals, 8) + 1;
  const min = 0;
  const x = (i: number) => pad + (i * (w - pad * 1.5)) / Math.max(points.length - 1, 1);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 1.5);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.v)}`).join(" ");
  const [lo, hi] = range.split("~").map((s) => Number(s.trim()));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full">
      {[0, 2, 4, 6, 8].map((g) => (
        <g key={g}>
          <line x1={pad} x2={w - pad / 2} y1={y(g)} y2={y(g)} stroke="hsl(var(--border))" strokeDasharray="2 3" />
          <text x={4} y={y(g) + 3} fontSize={9} fill="hsl(var(--muted-foreground))">{g}</text>
        </g>
      ))}
      {!isNaN(hi) && <line x1={pad} x2={w - pad / 2} y1={y(hi)} y2={y(hi)} stroke="hsl(var(--destructive))" strokeDasharray="3 3" opacity={0.6} />}
      {!isNaN(lo) && <line x1={pad} x2={w - pad / 2} y1={y(lo)} y2={y(lo)} stroke="hsl(var(--warning))" strokeDasharray="3 3" opacity={0.6} />}
      <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.v)} r={3} fill="white" stroke="hsl(var(--primary))" strokeWidth={2} />
      ))}
      {points.map((p, i) => (
        <text key={`t-${i}`} x={x(i)} y={h - 6} fontSize={8} fill="hsl(var(--muted-foreground))" textAnchor="middle">{p.date}</text>
      ))}
    </svg>
  );
};

const NursePatientDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const p = patients[id] || fallback(id);
  const [showMore, setShowMore] = useState(false);
  const [trendIdx, setTrendIdx] = useState(0);
  const [pushEduOpen, setPushEduOpen] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<Set<number>>(new Set());

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "push-edu") setPushEduOpen(true);
    if (action === "chat") {
      // jump straight into chat per task intent
      navigate(`/nurse/chat/patient/${id}`, { replace: true });
    }
  }, [searchParams, id, navigate]);

  const eduGroups = useMemo(() => eduByCategory(), []);
  const toggleEdu = (cid: number) =>
    setSelectedEdu((s) => {
      const n = new Set(s);
      n.has(cid) ? n.delete(cid) : n.add(cid);
      return n;
    });
  const closePushEdu = () => {
    setPushEduOpen(false);
    if (searchParams.get("action")) {
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  };
  const confirmPushEdu = () => {
    if (selectedEdu.size === 0) {
      toast({ title: "请选择宣教内容" });
      return;
    }
    toast({ title: "推送成功", description: `已向 ${p.name} 推送 ${selectedEdu.size} 条宣教` });
    setSelectedEdu(new Set());
    closePushEdu();
  };

  const fields = useMemo(() => {
    const base = [
      { k: "姓名", v: p.name },
      { k: "性别", v: p.gender },
      { k: "年龄", v: p.age ? `${p.age}岁` : "-" },
      { k: "身份证号", v: p.idCard },
    ];
    return showMore
      ? [...base, { k: "床位", v: p.bed }, { k: "主治医师", v: p.doctor }, { k: "主要诊断", v: p.diagnosis }, { k: "病症分类", v: p.condition }]
      : base;
  }, [p, showMore]);

  const statusTone = (s: Health["status"]) =>
    s === "正常" ? "bg-success/15 text-success" : s === "偏高" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning";

  return (
    <div className="bg-muted/30">
      {/* 子页头 */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-card px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">返回</span>
        </button>
        <h2 className="text-base font-semibold">{p.name}</h2>
        <span className="w-10" />
      </div>

      <div className="space-y-3 p-3">
        {/* 头像卡片 */}
        <Card className="flex flex-col items-center bg-card p-5 shadow-soft">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/30 text-2xl font-bold text-warning-foreground">
              {p.name[0]}
            </div>
            {p.vip && (
              <span className="absolute -right-1 -top-1 rounded-full bg-warning px-1.5 py-0.5 text-[9px] font-bold text-white">VIP</span>
            )}
          </div>
          <p className="mt-3 text-lg font-bold">{p.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{p.diagnosis}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">⏱ 更新于 {p.updatedAt}</p>

          <div className="mt-4 grid w-full grid-cols-3 gap-3">
            <button
              onClick={() => navigate(`/nurse/chat/patient/${p.id}`)}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                <MessageSquare className="h-5 w-5 text-primary" />
              </span>
              <span className="text-xs text-primary">沟通</span>
            </button>
            <button
              onClick={() => toast({ title: "正在呼叫", description: p.name })}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Phone className="h-5 w-5 text-primary" />
              </span>
              <span className="text-xs text-primary">电话</span>
            </button>
            <button
              onClick={() => toast({ title: "已发起会诊", description: `主治 ${p.doctor}` })}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15">
                <UsersIcon className="h-5 w-5 text-warning" />
              </span>
              <span className="text-xs text-warning">会诊</span>
            </button>
          </div>
        </Card>

        {/* 患者档案 */}
        <Card className="p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">患者档案</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((f) => (
              <div key={f.k} className="rounded-lg bg-muted/60 p-2.5">
                <p className="text-[10px] text-muted-foreground">{f.k}</p>
                <p className="mt-1 text-sm font-medium">{f.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded-lg bg-muted/60 p-2.5">
            <p className="text-[10px] text-muted-foreground">联系方式</p>
            <p className="mt-1 text-sm font-medium">{p.phone}</p>
          </div>
          <button
            onClick={() => setShowMore((v) => !v)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-primary/10 py-2.5 text-sm text-primary"
          >
            {showMore ? "收起" : "更多详情"}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
          </button>
        </Card>

        {/* 健康状态 */}
        <Card className="p-4 shadow-soft">
          <h3 className="mb-3 text-sm font-semibold">健康状态</h3>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success">健康良好</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{p.healthSummary}</p>
            </div>
          </div>
          <div className="divide-y">
            {p.health.map((h) => (
              <div key={h.label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-foreground/80">{h.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{h.value} {h.unit}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${statusTone(h.status)}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 当前用药 */}
        <Card className="p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">当前用药</h3>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {p.meds.map((m) => (
              <span key={m.name} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] text-primary">{m.name}</span>
            ))}
          </div>
          <div className="space-y-2">
            {p.meds.map((m) => (
              <div key={m.name} className="rounded-lg border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{m.start} ~ {m.end}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{m.freq} | 每次 {m.per}</p>
                <div className="mt-2 flex items-center justify-between border-t pt-2">
                  <span className="text-[11px] text-muted-foreground">服用天数: {m.days} 天</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${m.ended ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                    {m.ended ? "已结束" : "进行中"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 健康指标趋势 */}
        <Card className="p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">健康指标趋势</h3>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {p.trend.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTrendIdx(i)}
                className={`rounded-full px-3 py-1 text-[11px] transition-colors ${
                  trendIdx === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mb-1 text-[11px] text-muted-foreground">
            单位:{p.trend[trendIdx]?.unit} 参考范围:{p.trend[trendIdx]?.range}
          </p>
          <TrendChart points={p.trend[trendIdx]?.points || []} range={p.trend[trendIdx]?.range || ""} />
        </Card>

        {/* 生活方式 */}
        <Card className="p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold">生活方式</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.lifestyle.map((l) => (
              <span
                key={l.label}
                className={`rounded-full px-3 py-1 text-[11px] ${
                  l.tone === "good" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                }`}
              >
                {l.label}
              </span>
            ))}
            {p.lifestyle.length === 0 && <span className="text-[11px] text-muted-foreground">暂无记录</span>}
          </div>
        </Card>

        <div className="sticky bottom-0 -mx-3 grid grid-cols-3 gap-2 border-t bg-card/95 p-3 backdrop-blur">
          <Button variant="outline" onClick={() => navigate(`/nurse/chat/patient/${p.id}`)}>
            <MessageSquare className="mr-1 h-3.5 w-3.5" />沟通
          </Button>
          <Button variant="outline" onClick={() => setPushEduOpen(true)}>
            <Send className="mr-1 h-3.5 w-3.5" />立即推送
          </Button>
          <Button className="bg-gradient-nurse" onClick={() => toast({ title: "已生成出院下转单", description: "可在出院转交中推送至社区" })}>
            <FileText className="mr-1 h-3.5 w-3.5" />下转社区
          </Button>
        </div>
      </div>

      <ActionSheet
        open={pushEduOpen}
        onOpenChange={(v) => (v ? setPushEduOpen(true) : closePushEdu())}
        title="立即推送 · 宣教内容"
        description={`向 ${p.name} 推送宣教 · 已选 ${selectedEdu.size} 条`}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={closePushEdu}>取消</Button>
            <Button className="bg-gradient-nurse" onClick={confirmPushEdu}>
              <Send className="mr-1 h-4 w-4" />确认推送
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          {Object.entries(eduGroups).map(([cat, items]) => (
            <div key={cat}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground">{cat}</span>
              </div>
              <div className="space-y-1.5">
                {items.map((c) => {
                  const checked = selectedEdu.has(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 text-xs transition-colors ${
                        checked ? "border-accent bg-accent/5" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEdu(c.id)}
                        className="mt-0.5 h-4 w-4 accent-accent"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{c.desc} · {c.duration}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ActionSheet>
    </div>
  );
};

export default NursePatientDetail;
