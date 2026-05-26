import { useState } from "react";
import { Sparkles, BookOpen, Send, Users, User, TrendingUp, Bell, Search, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

const aiRecommended = [
  { id: 1, title: "糖尿病饮食指南", category: "糖尿病", match: "98%", views: 218, duration: "6 min", desc: "三餐搭配示例、升糖指数说明、外出就餐技巧及加餐建议。" },
  { id: 2, title: "胰岛素注射规范", category: "糖尿病", match: "95%", views: 174, duration: "3 min", desc: "标准注射部位轮换、剂量核对与低血糖应急处理。" },
  { id: 3, title: "甲亢低碘饮食指引", category: "甲状腺", match: "92%", views: 96, duration: "4 min", desc: "甲亢患者忌碘食物清单、就餐注意与外出技巧。" },
];

const library = [
  { id: 1, title: "低血糖识别与处理", category: "糖尿病", duration: "4 min", desc: "低血糖典型征兆、15-15 处理法则与家属配合要点。" },
  { id: 2, title: "家庭血糖监测要点", category: "糖尿病", duration: "5 min", desc: "指尖血糖采集流程、记录方式与异常上报。" },
  { id: 3, title: "甲减用药依从性", category: "甲状腺", duration: "4 min", desc: "左甲状腺素空腹服用、复查节奏与剂量调整。" },
  { id: 4, title: "出院后内分泌随访", category: "通用", duration: "8 min", desc: "复诊节奏、化验单解读与社区随访衔接。" },
];

const learners = [
  { id: 1, name: "张伟", bed: "0312", progress: 85, status: "学习中", unread: false },
  { id: 2, name: "李娜", bed: "0508", progress: 100, status: "已完成", unread: false },
  { id: 3, name: "王强", bed: "0215", progress: 0, status: "未开始", unread: true },
  { id: 4, name: "陈敏", bed: "0617", progress: 45, status: "学习中", unread: false },
];

type Content = (typeof aiRecommended)[0] | (typeof library)[0];

const NurseEducation = () => {
  const [tab, setTab] = useState<"todo" | "push" | "monitor">("todo");
  const [contentSheet, setContentSheet] = useState<Content | null>(null);
  const [pushTargetSheet, setPushTargetSheet] = useState<{ content: Content; mode: "batch" | "single" } | null>(null);
  const [pushModeSheet, setPushModeSheet] = useState<"batch" | "single" | null>(null);
  const [learnerSheet, setLearnerSheet] = useState<typeof learners[0] | null>(null);
  const [remindSheet, setRemindSheet] = useState(false);

  const confirmPush = () => {
    if (!pushTargetSheet) return;
    toast({
      title: "推送成功",
      description: `《${pushTargetSheet.content.title}》已${pushTargetSheet.mode === "batch" ? "批量" : ""}推送`,
    });
    setPushTargetSheet(null);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
        {[
          { k: "todo", label: "待办" },
          { k: "push", label: "推送" },
          { k: "monitor", label: "监控" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as any)}
            className={`rounded-md py-1.5 text-xs font-medium transition-all ${
              tab === t.k ? "bg-card shadow-soft" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "todo" && (
        <>
          <Card className="bg-gradient-card p-3 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">宣教待办</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">按住院阶段自动推送</p>
              </div>
              <Badge variant="destructive" className="h-5">3 待办</Badge>
            </div>
          </Card>

          {/* 阶段标签 */}
          {[
            { stage: "入院期", color: "bg-primary/10 text-primary border-primary/30", count: 1, todos: [
              { title: "入院须知 · 单人推送", patient: "陈敏 · 床 0617", content: "《住院环境与作息介绍》", due: "今日 16:00", mode: "单人" as const },
            ] },
            { stage: "治疗期", color: "bg-warning/10 text-warning border-warning/30", count: 1, todos: [
              { title: "胰岛素注射宣教 · 多人推送", patient: "内分泌科 · 12 人", content: "《胰岛素注射规范与低血糖应急》", due: "明日 10:00", mode: "多人" as const },
            ] },
            { stage: "出院期", color: "bg-success/10 text-success border-success/30", count: 1, todos: [
              { title: "居家血糖监测指导 · 单人推送", patient: "王芳 · 床 0408", content: "《出院后血糖监测与复诊安排》", due: "明日 09:00", mode: "单人" as const },
            ] },
          ].map((s) => (
            <Card key={s.stage} className="overflow-hidden">
              <div className={`flex items-center justify-between border-b px-4 py-2 ${s.color.split(" ").slice(0, 2).join(" ")}`}>
                <span className="text-xs font-semibold">{s.stage}</span>
                <Badge variant="outline" className="h-4 border-current text-[10px]">{s.count} 项</Badge>
              </div>
              <div className="divide-y">
                {s.todos.map((t, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.patient}</p>
                        <p className="mt-1 truncate text-[11px] text-foreground/70">📖 {t.content}</p>
                      </div>
                      <Badge variant="secondary" className="h-4 shrink-0 text-[10px]">{t.mode}</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">截止 {t.due}</span>
                      <Button size="sm" className="h-7 bg-gradient-nurse text-xs" onClick={() => toast({ title: "已推送", description: t.title })}>
                        <Send className="mr-1 h-3 w-3" />立即推送
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setTab("push")}
          >
            <Send className="mr-2 h-4 w-4" />新建宣教推送
          </Button>
        </>
      )}



      {tab === "push" && (
        <>
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">推送方式</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPushModeSheet("batch")}
                className="rounded-xl border-2 border-accent/30 bg-accent/5 p-4 text-left transition-colors hover:bg-accent/10"
              >
                <Users className="mb-2 h-5 w-5 text-accent" />
                <p className="text-sm font-semibold">批量推送</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">按科室/标签</p>
              </button>
              <button
                onClick={() => setPushModeSheet("single")}
                className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
              >
                <User className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">单患者推送</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">个性化推荐</p>
              </button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-semibold">最近推送记录</h3>
            </div>
            <div className="divide-y">
              {[
                { title: "糖尿病饮食指南", target: "内分泌科 · 28 人", time: "10 分钟前", read: 18 },
                { title: "胰岛素注射规范", target: "内分泌科 · 15 人", time: "1 小时前", read: 12 },
                { title: "甲亢低碘饮食指引", target: "内分泌科 · 8 人", time: "今日 09:30", read: 7 },
              ].map((r, i) => (
                <button
                  key={i}
                  onClick={() => toast({ title: r.title, description: `${r.target} · 已读 ${r.read}` })}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.title}</p>
                    <span className="text-[11px] text-muted-foreground">{r.time}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{r.target}</p>
                    <Badge variant="secondary" className="h-4 text-[10px]">已读 {r.read}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === "monitor" && (
        <>
          {/* 监控统计 */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <TrendingUp className="mx-auto h-4 w-4 text-success" />
              <p className="mt-1 text-lg font-semibold">68%</p>
              <p className="text-[11px] text-muted-foreground">完成率</p>
            </Card>
            <Card className="p-3 text-center">
              <Users className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-lg font-semibold">42</p>
              <p className="text-[11px] text-muted-foreground">参与人数</p>
            </Card>
            <Card className="p-3 text-center">
              <Bell className="mx-auto h-4 w-4 text-warning" />
              <p className="mt-1 text-lg font-semibold">8</p>
              <p className="text-[11px] text-muted-foreground">未读</p>
            </Card>
          </div>

          {/* 学习者进度 */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">学习进度</h3>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setRemindSheet(true)}>
                <Bell className="mr-1 h-3 w-3" />未读提醒
              </Button>
            </div>
            <div className="divide-y">
              {learners.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLearnerSheet(l)}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{l.name}</span>
                      <span className="text-[11px] text-muted-foreground">床 {l.bed}</span>
                      {l.unread && <Badge variant="destructive" className="h-4 px-1 text-[9px]">未读</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{l.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          l.progress === 100 ? "bg-success" : l.progress > 0 ? "bg-accent" : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] font-medium">{l.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* ========== Sheets ========== */}
      <ActionSheet
        open={!!contentSheet}
        onOpenChange={(v) => !v && setContentSheet(null)}
        title={contentSheet?.title || ""}
        description={contentSheet ? `${contentSheet.category} · ${contentSheet.duration}` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => toast({ title: "正在播放预览" })}>
              <Play className="mr-1 h-4 w-4" />预览
            </Button>
            <Button
              className="bg-gradient-nurse"
              onClick={() => contentSheet && setPushTargetSheet({ content: contentSheet, mode: "batch" })}
            >
              <Send className="mr-1 h-4 w-4" />推送
            </Button>
          </div>
        }
      >
        {contentSheet && (
          <div className="space-y-3 py-2">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-soft">
                <Play className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{contentSheet.desc}</p>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={!!pushTargetSheet}
        onOpenChange={(v) => !v && setPushTargetSheet(null)}
        title="选择推送目标"
        description={pushTargetSheet?.content.title}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setPushTargetSheet(null)}>取消</Button>
            <Button className="bg-gradient-nurse" onClick={confirmPush}>
              <Send className="mr-1 h-4 w-4" />确认推送
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">选择患者</p>
          <div className="space-y-1.5">
            {learners.map((l, i) => (
              <label key={l.id} className="flex items-center gap-3 rounded-lg border p-2.5 text-xs">
                <input type="checkbox" defaultChecked={i === 0} className="h-4 w-4 accent-accent" />
                <span className="flex-1">{l.name} · 床 {l.bed}</span>
              </label>
            ))}
          </div>
        </div>
      </ActionSheet>

      <ActionSheet
        open={!!pushModeSheet}
        onOpenChange={(v) => !v && setPushModeSheet(null)}
        title={pushModeSheet === "batch" ? "批量推送 · 选择内容" : "单患者推送 · 选择内容"}
        description="从宣教库中挑选要推送的内容"
      >
        <div className="space-y-2 py-2">
          {[...aiRecommended, ...library].map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setPushModeSheet(null);
                setTimeout(() => setPushTargetSheet({ content: c, mode: pushModeSheet || "batch" }), 200);
              }}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <BookOpen className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="text-[11px] text-muted-foreground">{c.category} · {c.duration}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </ActionSheet>

      <ActionSheet
        open={!!learnerSheet}
        onOpenChange={(v) => !v && setLearnerSheet(null)}
        title={learnerSheet ? `${learnerSheet.name} · 床 ${learnerSheet.bed}` : ""}
        description={`学习状态:${learnerSheet?.status} · 进度 ${learnerSheet?.progress}%`}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => { toast({ title: "已发送提醒" }); setLearnerSheet(null); }}>
              <Bell className="mr-1 h-4 w-4" />单独提醒
            </Button>
            <Button className="bg-gradient-nurse" onClick={() => { toast({ title: "已推送新内容" }); setLearnerSheet(null); }}>
              <Send className="mr-1 h-4 w-4" />追加推送
            </Button>
          </div>
        }
      >
        {learnerSheet && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground">完成进度</span>
                <span className="font-semibold">{learnerSheet.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${learnerSheet.progress === 100 ? "bg-success" : "bg-accent"}`}
                  style={{ width: `${learnerSheet.progress}%` }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="font-medium text-muted-foreground">已推送内容</p>
              {library.slice(0, 3).map((l, i) => (
                <div key={l.id} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${i === 0 ? "text-success" : "text-muted-foreground/40"}`} />
                  <span className="flex-1">{l.title}</span>
                  <span className="text-[10px] text-muted-foreground">{i === 0 ? "已完成" : "未完成"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={remindSheet}
        onOpenChange={setRemindSheet}
        title="未读提醒"
        description={`将向 ${learners.filter((l) => l.unread).length} 位未学习患者发送提醒`}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setRemindSheet(false)}>取消</Button>
            <Button
              className="bg-gradient-nurse"
              onClick={() => { toast({ title: "提醒已批量发送" }); setRemindSheet(false); }}
            >
              <Bell className="mr-1 h-4 w-4" />确认发送
            </Button>
          </div>
        }
      >
        <div className="space-y-2 py-2">
          {learners.filter((l) => l.unread || l.progress < 100).map((l) => (
            <label key={l.id} className="flex items-center gap-3 rounded-lg border p-2.5 text-xs">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-accent" />
              <div className="flex-1">
                <p className="font-medium">{l.name} · 床 {l.bed}</p>
                <p className="text-[10px] text-muted-foreground">进度 {l.progress}%</p>
              </div>
              {l.unread && <Badge variant="destructive" className="h-4 px-1 text-[9px]">未读</Badge>}
            </label>
          ))}
        </div>
      </ActionSheet>
    </div>
  );
};

export default NurseEducation;
