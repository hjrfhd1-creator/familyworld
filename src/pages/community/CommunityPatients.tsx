import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronRight, MessageSquare, Hospital, Stethoscope, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionSheet from "@/components/nurse/ActionSheet";

/* ========== 住院状态映射（与护士端一致） ========== */
// orisStatus: null=无住院记录, 0=住院准备, 1=住院办理, 2=住院当天, 3/4/5=待出院, 6=出院/院后康复
type StageKey = "全部" | "待入院" | "院中" | "待出院" | "院后康复" | "历史";

const STAGE_TABS: StageKey[] = ["全部", "待入院", "院中", "待出院", "院后康复", "历史"];

function orisStatusToStage(orisStatus: number | null, isExpired: boolean): string {
  if (isExpired) return "历史";
  if (orisStatus == null) return "待入院";
  if (orisStatus === 6) return "院后康复";
  if (orisStatus === 3 || orisStatus === 4 || orisStatus === 5) return "待出院";
  if ([0, 1, 2].includes(orisStatus)) return "院中";
  return "待入院";
}

const stageStyleMap: Record<string, string> = {
  "待入院": "bg-muted text-muted-foreground",
  "院中": "bg-warning/15 text-warning",
  "待出院": "bg-primary/15 text-primary",
  "院后康复": "bg-success/15 text-success",
  "历史": "bg-muted/50 text-muted-foreground",
};

/* ========== 患者来源标签 ========== */
// registerSource: 1=社区扫码(社区自有), 2=医院扫码(医院下转)
type SourceLabel = "社区自有" | "医院下转";

function getRegisterSourceLabel(registerSource: string | null, stationName: string | null): SourceLabel {
  if (registerSource === "2") return "医院下转";
  if (registerSource === "1") return "社区自有";
  // 兜底：如果 stationName 包含医院关键词，也算下转
  if (stationName && (stationName.includes("医院") || stationName.includes("鼓楼"))) return "医院下转";
  return "社区自有";
}

/* ========== 患者数据类型 ========== */
type Patient = {
  id: number;
  personId: number | null;
  name: string;
  age: number;
  gender: "男" | "女";
  diagnosis: string;
  orisStatus: number | null;
  orisStatusStr: string;
  realAdmissionDate: string;
  admissionDayStr: string;
  isExpired: boolean;
  stage: string;
  healthLabels: string[];
  registerSource: string | null;       // 注册来源：1=社区, 2=医院
  sourceLabel: SourceLabel;            // 来源标签
  stationId: number | null;
  stationName: string | null;
  unreadMsgNum: number;
  referralDept: string;
  referralDoctor: string;
};

// TODO: 接入真实 IM WebSocket 后替换以下 mock 数据
// 社区端患者列表 = 下转到本社区的患者 + 社区自有患者
// 与护士端区别：护士端看自己负责的所有患者，社区端只看下转给本社区的
const mockPatients: Patient[] = [
  {
    id: 1, personId: 1001, name: "张伟", age: 58, gender: "男",
    diagnosis: "2 型糖尿病 · 酮症倾向", orisStatus: 6, orisStatusStr: "院后康复",
    realAdmissionDate: "2026-05-10", admissionDayStr: "第16天",
    isExpired: false, stage: "院后康复",
    healthLabels: ["糖尿病"],
    registerSource: "2", sourceLabel: "医院下转", stationId: 100, stationName: "南京市鼓楼医院",
    unreadMsgNum: 2, referralDept: "内分泌科", referralDoctor: "王主任",
  },
  {
    id: 2, personId: 1002, name: "李建国", age: 62, gender: "男",
    diagnosis: "2 型糖尿病 · 血糖控制不佳", orisStatus: 6, orisStatusStr: "院后康复",
    realAdmissionDate: "2026-04-20", admissionDayStr: "",
    isExpired: false, stage: "院后康复",
    healthLabels: ["糖尿病"],
    registerSource: "1", sourceLabel: "社区自有", stationId: 200, stationName: "兰园社区",
    unreadMsgNum: 0, referralDept: "内分泌科", referralDoctor: "王主任",
  },
  {
    id: 3, personId: 1003, name: "刘秀英", age: 67, gender: "女",
    diagnosis: "桥本甲状腺炎 · 甲减", orisStatus: null, orisStatusStr: "",
    realAdmissionDate: "", admissionDayStr: "",
    isExpired: false, stage: "待入院",
    healthLabels: ["甲减"],
    registerSource: "1", sourceLabel: "社区自有", stationId: 200, stationName: "兰园社区",
    unreadMsgNum: 0, referralDept: "内分泌科", referralDoctor: "李医生",
  },
  {
    id: 4, personId: 1004, name: "陈敏", age: 55, gender: "女",
    diagnosis: "1 型糖尿病", orisStatus: 4, orisStatusStr: "待出院",
    realAdmissionDate: "2026-05-18", admissionDayStr: "第8天",
    isExpired: false, stage: "待出院",
    healthLabels: ["糖尿病"],
    registerSource: "2", sourceLabel: "医院下转", stationId: 100, stationName: "南京市鼓楼医院",
    unreadMsgNum: 1, referralDept: "内分泌科", referralDoctor: "张医生",
  },
  {
    id: 5, personId: 1005, name: "周春华", age: 71, gender: "女",
    diagnosis: "糖尿病酮症 · 血糖↑", orisStatus: 6, orisStatusStr: "院后康复",
    realAdmissionDate: "2026-05-20", admissionDayStr: "",
    isExpired: false, stage: "院后康复",
    healthLabels: ["糖尿病"],
    registerSource: "1", sourceLabel: "社区自有", stationId: 200, stationName: "兰园社区",
    unreadMsgNum: 3, referralDept: "内分泌科", referralDoctor: "王主任",
  },
  {
    id: 6, personId: 1006, name: "赵磊", age: 48, gender: "男",
    diagnosis: "Graves 病 · 甲亢复查", orisStatus: 1, orisStatusStr: "住院办理",
    realAdmissionDate: "2026-05-24", admissionDayStr: "第2天",
    isExpired: false, stage: "院中",
    healthLabels: ["甲亢"],
    registerSource: "2", sourceLabel: "医院下转", stationId: 100, stationName: "南京市鼓楼医院",
    unreadMsgNum: 0, referralDept: "内分泌科", referralDoctor: "李医生",
  },
  {
    id: 7, personId: 1007, name: "王芳", age: 63, gender: "女",
    diagnosis: "2 型糖尿病 · 肾病 III 期", orisStatus: 6, orisStatusStr: "院后康复",
    realAdmissionDate: "2026-03-01", admissionDayStr: "",
    isExpired: true, stage: "历史",
    healthLabels: ["糖尿病"],
    registerSource: "2", sourceLabel: "医院下转", stationId: 100, stationName: "南京市鼓楼医院",
    unreadMsgNum: 0, referralDept: "内分泌科", referralDoctor: "张医生",
  },
];

const CommunityPatients = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>(
    params.get("tab") === "new" ? "待入院" :
    params.get("tab") === "abnormal" ? "院后康复" : "全部"
  );
  const [labelFilter, setLabelFilter] = useState<string>("全部");
  const [referFor, setReferFor] = useState<Patient | null>(null);

  // TODO: 接入 IM WebSocket
  // const { chatList, refreshChatList } = useIMWebSocket();
  // useEffect(() => { refreshChatList(); }, []);

  // TODO: 从 chatList 中解析患者数据（与护士端 NursePatients 逻辑一致）
  // 区别：护士端 consultType===1 全量，社区端只取下转到本社区 stationId 的
  // const patients = useMemo(() => {
  //   return (chatList || [])
  //     .filter((g: any) => g.consultType === 1)
  //     .filter((g: any) => {
  //       // 社区端筛选：本站点的患者（stationId 匹配）或 registerSource=1/2
  //       return g.stationId === currentStationId || g.registerSource === "1";
  //     })
  //     .map((g: any) => { ... });
  // }, [chatList]);

  const patients = useMemo(() => mockPatients, []);

  // 所有疾病标签（用于筛选）
  const allLabels = useMemo(() => {
    const set = new Set<string>();
    patients.forEach((p) => p.healthLabels.forEach((l) => set.add(l)));
    return ["全部", ...Array.from(set).sort()];
  }, [patients]);

  // 筛选
  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const ms = !search || p.name.includes(search);
      const mf = stageFilter === "全部" || p.stage === stageFilter;
      const ml = labelFilter === "全部" || p.healthLabels.includes(labelFilter);
      return ms && mf && ml;
    }).sort((a, b) => {
      // 异常/未读优先
      const aPriority = (a.unreadMsgNum > 0 ? 1 : 0);
      const bPriority = (b.unreadMsgNum > 0 ? 1 : 0);
      return bPriority - aPriority;
    });
  }, [patients, search, stageFilter, labelFilter]);

  // Tab 计数
  const stageCount = (stage: string) =>
    stage === "全部" ? patients.length : patients.filter((p) => p.stage === stage).length;

  const confirmReferral = () => {
    if (!referFor) return;
    const p = referFor;
    setReferFor(null);
    navigate(`/community/chat/patient/${p.id}`, {
      state: {
        referral: {
          dept: p.referralDept,
          doctor: p.referralDoctor,
          url: "https://www.njglyy.com/",
        },
      },
    });
  };

  return (
    <div className="space-y-3 p-4">
      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索患者姓名"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* 住院状态 Tabs（与护士端一致） */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {STAGE_TABS.map((t) => {
          const active = stageFilter === t;
          const count = stageCount(t);
          return (
            <button
              key={t}
              onClick={() => setStageFilter(t)}
              className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground"
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

      {/* 疾病标签筛选 */}
      {allLabels.length > 1 && (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
          {allLabels.map((label) => {
            const active = labelFilter === label;
            return (
              <button
                key={label}
                onClick={() => setLabelFilter(label)}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] transition-colors ${
                  active ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* 患者列表 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">患者列表</h3>
          <span className="text-xs text-muted-foreground">{filtered.length} 位</span>
        </div>
        <div className="divide-y">
          {filtered.length === 0 && <div className="px-4 py-10 text-center text-sm text-muted-foreground">无匹配患者</div>}
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/community/patients/${p.personId || p.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              {/* 头像 */}
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                p.isExpired ? "bg-muted/20 text-muted-foreground" :
                p.unreadMsgNum > 0 ? "bg-destructive/15 text-destructive" :
                "bg-accent/10 text-accent"
              }`}>
                {p.name[0]}
              </div>

              {/* 信息区 */}
              <div className="min-w-0 flex-1">
                {/* 第一行：姓名 + 来源标签 + 未读 */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{p.name}</span>
                  {/* 来源标签：社区自有 / 医院下转 */}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    p.sourceLabel === "医院下转"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {p.sourceLabel === "医院下转" ? (
                      <span className="inline-flex items-center gap-0.5"><Download className="h-2.5 w-2.5" />{p.sourceLabel}</span>
                    ) : p.sourceLabel}
                  </span>
                  {p.unreadMsgNum > 0 && (
                    <Badge variant="destructive" className="h-4 px-1 text-[9px]">{p.unreadMsgNum}</Badge>
                  )}
                </div>

                {/* 第二行：住院状态 + 疾病标签 */}
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${stageStyleMap[p.stage] || "bg-muted text-muted-foreground"}`}>
                    {p.stage}
                  </span>
                  {p.healthLabels.slice(0, 3).map((label, i) => (
                    <span key={i} className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">{label}</span>
                  ))}
                  {p.admissionDayStr && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{p.admissionDayStr}</span>
                  )}
                </div>

                {/* 第三行：操作 */}
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    onClick={(e) => { e.stopPropagation(); navigate(`/community/chat/patient/${p.id}`); }}
                    className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 text-[10px] text-accent"
                  >
                    <MessageSquare className="h-3 w-3" />沟通
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); setReferFor(p); }}
                    className="flex items-center gap-1 rounded-full border border-warning/30 bg-warning/5 px-2 py-0.5 text-[10px] text-warning"
                  >
                    <Hospital className="h-3 w-3" />转诊鼓楼
                  </span>
                  {p.orisStatus === 6 && !p.isExpired && (
                    <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">
                      <Stethoscope className="h-2.5 w-2.5" />随访中
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

      {/* 转诊鼓楼 */}
      <ActionSheet
        open={!!referFor}
        onOpenChange={(v) => !v && setReferFor(null)}
        title="转诊至南京市鼓楼医院"
        description={referFor ? `为 ${referFor.name} 推荐互联网医院挂号` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setReferFor(null)}>取消</Button>
            <Button className="bg-gradient-community" onClick={confirmReferral}>
              <Hospital className="mr-1 h-4 w-4" />确认
            </Button>
          </div>
        }
      >
        {referFor && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">接收科室</p>
              <p className="mt-1 font-medium">南京市鼓楼医院 · {referFor.referralDept}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">推荐医生</p>
              <p className="mt-1 flex items-center gap-1.5 font-medium">
                <Stethoscope className="h-3.5 w-3.5 text-primary" />
                {referFor.referralDoctor} · {referFor.referralDept}
              </p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 text-muted-foreground">
              确认后将跳转至与患者的沟通界面，并自动发送 {referFor.referralDoctor} 的互联网医院挂号地址，由患者自主完成挂号。
            </div>
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default CommunityPatients;
