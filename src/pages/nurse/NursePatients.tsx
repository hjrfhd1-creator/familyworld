import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, ChevronRight, MessageSquare, Users as UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Stage = "待入院" | "院中" | "待出院" | "历史";
type Source = "南京市鼓楼医院" | "兰园社区";
type Patient = {
  id: number;
  name: string;
  bed: string;
  age: number;
  gender: "男" | "女";
  diagnosis: string;
  condition: string; // 病症
  stage: Stage;
  source: Source;
  allergy: string;
  doctor: string;
  abnormal: boolean;
  metric: { label: string; value: string; unit: string };
  hba1c: string;
  meds: { name: string; dose: string }[];
};

const allPatients: Patient[] = [
  { id: 1, name: "张伟", bed: "0312", age: 58, gender: "男", diagnosis: "2 型糖尿病 · 酮症倾向", condition: "糖尿病", stage: "院中", source: "南京市鼓楼医院", allergy: "青霉素", doctor: "王主任", abnormal: true,
    metric: { label: "随机血糖", value: "16.8", unit: "mmol/L" }, hba1c: "9.2%",
    meds: [{ name: "门冬胰岛素", dose: "8U 三餐前皮下" }, { name: "二甲双胍", dose: "0.5g 每日 3 次" }] },
  { id: 2, name: "李娜", bed: "0508", age: 45, gender: "女", diagnosis: "2 型糖尿病 · 周围神经病变", condition: "糖尿病", stage: "院中", source: "南京市鼓楼医院", allergy: "无", doctor: "李医生", abnormal: true,
    metric: { label: "空腹血糖", value: "9.6", unit: "mmol/L" }, hba1c: "8.4%",
    meds: [{ name: "甘精胰岛素", dose: "16U 睡前" }, { name: "甲钴胺", dose: "0.5mg 每日 3 次" }] },
  { id: 3, name: "王强", bed: "0215", age: 42, gender: "男", diagnosis: "Graves 病 · 甲状腺功能亢进", condition: "甲亢", stage: "院中", source: "南京市鼓楼医院", allergy: "无", doctor: "王主任", abnormal: true,
    metric: { label: "心率", value: "128", unit: "bpm" }, hba1c: "—",
    meds: [{ name: "甲巯咪唑", dose: "10mg 每日 3 次" }, { name: "美托洛尔", dose: "25mg 每日 2 次" }] },
  { id: 4, name: "陈敏", bed: "0617", age: 51, gender: "女", diagnosis: "1 型糖尿病", condition: "糖尿病", stage: "待出院", source: "南京市鼓楼医院", allergy: "海鲜", doctor: "张医生", abnormal: false,
    metric: { label: "空腹血糖", value: "6.2", unit: "mmol/L" }, hba1c: "6.8%",
    meds: [{ name: "门冬胰岛素", dose: "6U 三餐前" }, { name: "地特胰岛素", dose: "12U 睡前" }] },
  { id: 5, name: "赵磊", bed: "—", age: 48, gender: "男", diagnosis: "桥本甲状腺炎 · 甲减", condition: "甲减", stage: "待入院", source: "兰园社区", allergy: "无", doctor: "李医生", abnormal: false,
    metric: { label: "TSH", value: "5.8", unit: "mIU/L" }, hba1c: "—",
    meds: [{ name: "左甲状腺素钠", dose: "75μg 早餐前" }] },
  { id: 6, name: "周婷", bed: "0305", age: 39, gender: "女", diagnosis: "妊娠糖尿病", condition: "糖尿病", stage: "院中", source: "南京市鼓楼医院", allergy: "无", doctor: "张医生", abnormal: false,
    metric: { label: "餐后 2h", value: "8.4", unit: "mmol/L" }, hba1c: "6.2%",
    meds: [{ name: "门冬胰岛素", dose: "4U 三餐前" }] },
  { id: 7, name: "刘洋", bed: "—", age: 36, gender: "男", diagnosis: "库欣综合征 · 继发性高血压", condition: "库欣综合征", stage: "历史", source: "兰园社区", allergy: "无", doctor: "王主任", abnormal: false,
    metric: { label: "血压", value: "138/86", unit: "mmHg" }, hba1c: "5.9%",
    meds: [{ name: "螺内酯", dose: "20mg 每日 2 次" }] },
];

const stageTabs: ("全部" | Stage)[] = ["全部", "待入院", "院中", "待出院", "历史"];

const NursePatients = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>(params.get("filter") || "全部");
  const [conditionFilter, setConditionFilter] = useState<string>("全部疾病");
  

  const conditions = useMemo(() => {
    const set = new Set<string>(["全部疾病"]);
    allPatients.forEach((p) => set.add(p.condition));
    return Array.from(set);
  }, []);

  const list = useMemo(
    () =>
      allPatients
        .filter((p) => {
          const ms = !search || p.name.includes(search) || p.bed.includes(search);
          const mf = filter === "全部" || p.stage === filter;
          const mc = conditionFilter === "全部疾病" || p.condition === conditionFilter;
          return ms && mf && mc;
        })
        .sort((a, b) => Number(b.abnormal) - Number(a.abnormal)),
    [search, filter, conditionFilter]
  );

  const stageCount = (s: Stage) => allPatients.filter((p) => p.stage === s).length;

  const openPatient = (p: Patient) => navigate(`/nurse/patients/${p.id}`);

  return (
    <div className="space-y-3 p-4">
      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索患者姓名/床位"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* 状态 Tabs */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {stageTabs.map((t) => {
          const active = filter === t;
          const count = t === "全部" ? allPatients.length : stageCount(t);
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {t}
              <span className={`rounded-full px-1.5 text-[10px] ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 病症筛选 */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
        {conditions.map((c) => {
          const active = conditionFilter === c;
          return (
            <button
              key={c}
              onClick={() => setConditionFilter(c)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] transition-colors ${
                active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* 患者列表 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">患者列表</h3>
          <span className="text-xs text-muted-foreground">{list.length} 位</span>
        </div>
        <div className="divide-y">
          {list.length === 0 && <div className="px-4 py-10 text-center text-sm text-muted-foreground">无匹配患者</div>}
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => openPatient(p)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              {/* 头像 */}
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold ${p.abnormal ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {p.name[0]}
                </div>
                <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[8px] text-white">
                  <UsersIcon className="h-2.5 w-2.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">我负责</span>
                  {p.abnormal && <Badge variant="destructive" className="h-4 px-1 text-[9px]">异常</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${p.source === "南京市鼓楼医院" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                    {p.source === "南京市鼓楼医院" ? "鼓楼" : "兰园社区"}
                  </span>
                  <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">{p.condition}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{p.stage}</span>
                  {p.bed !== "—" && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">床 {p.bed}</span>}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    onClick={(e) => { e.stopPropagation(); navigate(`/nurse/chat/patient/${p.id}`); }}
                    className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary"
                  >
                    <MessageSquare className="h-3 w-3" />沟通
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-warning/30 bg-warning/5 px-2 py-0.5 text-[10px] text-warning">
                    <UsersIcon className="h-3 w-3" />会诊
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default NursePatients;
