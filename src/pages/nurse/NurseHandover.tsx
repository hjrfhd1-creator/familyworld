import { useState } from "react";
import { LogOut, FileText, Send, History, ChevronRight, User, CheckCircle2, Clock, Building2, Home, ArrowRightLeft, Search, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const dischargeList = [
  { id: 1, name: "王芳", bed: "0408", date: "今日 14:00", status: "待交接", doctor: "张医生" },
  { id: 2, name: "刘洋", bed: "0612", date: "今日 16:30", status: "准备中", doctor: "李医生" },
  { id: 3, name: "周婷", bed: "0305", date: "明日 09:00", status: "待交接", doctor: "王医生" },
];

const history = [
  { id: 1, name: "陈雪", bed: "0507", date: "昨日 10:30", receiver: "社区护士 · 张丽", status: "已完成", type: "转入社区" },
  { id: 2, name: "黄伟", bed: "0218", date: "昨日 15:00", receiver: "家属 · 黄先生", status: "已完成", type: "居家护理" },
];

// 社区人员 mock（professionsTypeId=5）
const communityStaff = [
  { id: 101, name: "张丽", title: "普通社区护士", department: "兰园社区卫生服务中心" },
  { id: 102, name: "王建国", title: "专家社区护士", department: "兰园社区卫生服务中心" },
  { id: 103, name: "李梅", title: "普通社区护士", department: "鼓楼社区卫生服务中心" },
];

// ===== 转入社区弹窗 =====
const CommunityHandoverDialog = ({
  open, onClose, patientName, onConfirmed,
}: {
  open: boolean;
  onClose: () => void;
  patientName: string;
  onConfirmed: (staff: any) => void;
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const filtered = communityStaff.filter(s =>
    !search || s.name.includes(search) || s.title.includes(search) || s.department.includes(search)
  );

  const grouped = filtered.reduce((acc: any, s) => {
    if (!acc[s.department]) acc[s.department] = [];
    acc[s.department].push(s);
    return acc;
  }, {});

  const handleClose = () => {
    setSearch(''); setSelected(null); setReason(''); setStep('select');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-[420px] w-[90vw] rounded-2xl p-0 gap-0 max-h-[85vh] flex flex-col">
        <DialogHeader className="p-5 pb-3 border-b">
          <DialogTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            转入社区 · {patientName}
          </DialogTitle>
          <DialogDescription className="text-xs mt-1">选择社区接收人并填写转交原因</DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="relative mx-5 mt-4 mb-3">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索姓名、职称、社区..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
              {Object.entries(grouped).map(([dept, staff]: any) => (
                <div key={dept}>
                  <p className="text-[11px] text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-primary/60" />
                    {dept} · {staff.length}人
                  </p>
                  <div className="space-y-1.5">
                    {staff.map((s: any) => (
                      <button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          selected?.id === s.id ? 'bg-primary/8 ring-1 ring-primary/40' : 'bg-secondary/60 hover:bg-secondary'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          selected?.id === s.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>{s.name[0]}</div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-[11px] text-muted-foreground">{s.title}</p>
                        </div>
                        {selected?.id === s.id ? (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-border/60" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button
                disabled={!selected}
                onClick={() => setStep('confirm')}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-40"
              >
                下一步
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 rounded-xl bg-primary/5 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">转出</p>
                <p className="text-sm font-semibold">李护士</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 p-3 rounded-xl bg-primary/5 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">社区接收</p>
                <p className="text-sm font-semibold text-primary">{selected?.name}</p>
                <p className="text-[10px] text-muted-foreground">{selected?.title}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block">转交原因 <span className="text-destructive">*</span></label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请填写转入社区的原因..."
                rows={3}
                className="text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl text-sm font-medium bg-secondary text-foreground">返回</button>
              <button
                disabled={!reason.trim()}
                onClick={() => {
                  toast({ title: `已将 ${patientName} 转入社区`, description: `接收人：${selected?.name}` });
                  onConfirmed(selected);
                  handleClose();
                }}
                className="flex-[1.5] py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-40"
              >
                确认转入社区
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ===== 居家护理确认弹窗 =====
const HomeNursingDialog = ({
  open, onClose, patientName, onConfirmed,
}: {
  open: boolean;
  onClose: () => void;
  patientName: string;
  onConfirmed: () => void;
}) => (
  <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
    <DialogContent className="max-w-[360px] w-[90vw] rounded-2xl p-6">
      <DialogHeader>
        <DialogTitle className="text-base flex items-center gap-2">
          <Home className="h-4 w-4 text-accent" />
          居家护理确认
        </DialogTitle>
        <DialogDescription className="text-xs mt-1">
          确认后将结束对 <span className="font-semibold text-foreground">{patientName}</span> 的管理，并打上"居家护理"标签。
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 p-3 rounded-xl bg-warning/5 border border-warning/20">
        <p className="text-xs text-warning font-medium">注意事项</p>
        <ul className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
          <li>· 患者将由家属/居家护理人员协助</li>
          <li>· 系统将自动打上"居家护理"标签</li>
          <li>· 管理结束后不再产生随访任务</li>
        </ul>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-secondary text-foreground">取消</button>
        <button
          onClick={() => {
            toast({ title: `${patientName} 已标记为居家护理`, description: "管理已结束" });
            onConfirmed();
            onClose();
          }}
          className="flex-[1.5] py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--gradient-nurse)' }}
        >
          确认居家护理
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

// ===== 主页面 =====
const NurseHandover = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [selected, setSelected] = useState<typeof dischargeList[0] | null>(null);
  const [note, setNote] = useState("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [historyList, setHistoryList] = useState(history);
  const [pendingList, setPendingList] = useState(dischargeList);

  const handleTransferred = (patient: typeof dischargeList[0], type: string, receiver?: string) => {
    setPendingList(prev => prev.filter(p => p.id !== patient.id));
    setHistoryList(prev => [{
      id: Date.now(),
      name: patient.name,
      bed: patient.bed,
      date: "今日",
      receiver: receiver || "居家护理",
      status: "已完成",
      type,
    }, ...prev]);
    setSelected(null);
  };

  if (selected) {
    return (
      <div className="space-y-4 p-4">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">
          ← 返回列表
        </button>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground" style={{ background: 'var(--gradient-nurse)' }}>
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{selected.name}</p>
              <p className="text-xs text-muted-foreground">床位 {selected.bed} · 主治 {selected.doctor}</p>
            </div>
            <Badge variant="secondary">{selected.date}</Badge>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">交接准备</span>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-lg bg-muted/40 p-3 text-xs leading-relaxed">
              住院 5 天，空腹血糖控制在 6.2 mmol/L、餐后 7.4 mmol/L，糖化血红蛋白 6.8%，无低血糖事件。已完成胰岛素注射宣教及饮食指导。建议社区每周随访血糖一次。
            </div>
            <div className="space-y-1.5">
              {["用药清单 · 5 项", "复查计划 · 2 周后", "饮食运动建议", "应急联系方式"].map((it) => (
                <div key={it} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>{it}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">补充说明</p>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="可补充交接事项..." className="min-h-[60px] text-xs" />
            </div>
          </div>
        </Card>

        {/* 转交方式选择 */}
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <Send className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">选择转交方式</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={() => setCommunityOpen(true)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">转入社区</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">选择社区接收人，继续随访管理</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => setHomeOpen(true)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-accent/20 bg-accent/5 hover:border-accent/40 hover:bg-accent/10 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Home className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">居家护理</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">由家属协助，结束管理并打标签</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </Card>

        <CommunityHandoverDialog
          open={communityOpen}
          onClose={() => setCommunityOpen(false)}
          patientName={selected.name}
          onConfirmed={(staff) => handleTransferred(selected, '转入社区', `社区护士 · ${staff.name}`)}
        />
        <HomeNursingDialog
          open={homeOpen}
          onClose={() => setHomeOpen(false)}
          patientName={selected.name}
          onConfirmed={() => handleTransferred(selected, '居家护理', '居家护理')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <button onClick={() => setActiveTab("pending")} className={`rounded-md py-1.5 text-sm font-medium transition-all ${activeTab === "pending" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>出院列表</button>
        <button onClick={() => setActiveTab("history")} className={`rounded-md py-1.5 text-sm font-medium transition-all ${activeTab === "history" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>交接记录</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <p className="text-xl font-semibold text-primary">{pendingList.length}</p>
          <p className="text-[11px] text-muted-foreground">待交接</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-semibold text-warning">{pendingList.filter(p => p.status === '待交接').length}</p>
          <p className="text-[11px] text-muted-foreground">紧急</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-semibold text-success">{historyList.length}</p>
          <p className="text-[11px] text-muted-foreground">本周完成</p>
        </Card>
      </div>

      {activeTab === "pending" ? (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <LogOut className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">出院待交接</h3>
            </div>
          </div>
          <div className="divide-y">
            {pendingList.length === 0 && <div className="px-4 py-10 text-center text-sm text-muted-foreground">暂无待交接患者</div>}
            {pendingList.map((p) => (
              <button key={p.id} onClick={() => setSelected(p)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{p.bed}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{p.name}</span>
                    <Badge variant={p.status === "待交接" ? "destructive" : "secondary"} className="h-4 px-1 text-[9px]">{p.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">出院 · {p.date}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <History className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">历史交接记录</h3>
            </div>
          </div>
          <div className="divide-y">
            {historyList.map((h) => (
              <div key={h.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">{h.name} · 床 {h.bed}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        h.type === '转入社区' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                      }`}>{h.type}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">接收人：{h.receiver}</p>
                  </div>
                  <Badge variant="outline" className="h-5 border-success text-[10px] text-success">
                    <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />{h.status}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />{h.date}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NurseHandover;
