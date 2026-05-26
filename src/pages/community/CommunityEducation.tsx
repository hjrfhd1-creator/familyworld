import { useState } from "react";
import { BookOpen, Send, Search, Play, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

const todos = [
  { stage: "新建档", color: "bg-accent/10 text-accent border-accent/30", todos: [
    { title: "家庭血糖监测 · 单人推送", patient: "张伟 · 兰园社区", content: "《家庭血糖监测要点》", due: "今日 16:00" },
  ] },
  { stage: "随访中", color: "bg-warning/10 text-warning border-warning/30", todos: [
    { title: "糖尿病饮食指南 · 多人推送", patient: "糖尿病小组 · 12 人", content: "《低糖饮食与加餐建议》", due: "明日 10:00" },
  ] },
  { stage: "复诊期", color: "bg-success/10 text-success border-success/30", todos: [
    { title: "甲减用药依从性 · 单人推送", patient: "刘秀英 · 兰园社区", content: "《左甲状腺素空腹服用须知》", due: "明日 09:00" },
  ] },
];

const library = [
  { id: 1, title: "家庭血糖监测要点", category: "糖尿病", duration: "5 min" },
  { id: 2, title: "低糖饮食与加餐建议", category: "糖尿病", duration: "6 min" },
  { id: 3, title: "胰岛素居家注射规范", category: "糖尿病", duration: "4 min" },
  { id: 4, title: "甲减用药依从性", category: "甲状腺", duration: "3 min" },
  { id: 5, title: "甲亢低碘饮食指引", category: "甲状腺", duration: "4 min" },
  { id: 6, title: "低血糖识别与处理", category: "糖尿病", duration: "4 min" },
];

const CommunityEducation = () => {
  const [tab, setTab] = useState<"todo" | "library">("todo");
  const [target, setTarget] = useState<typeof library[0] | null>(null);

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {[{ k: "todo", label: "待办" }, { k: "library", label: "宣教库" }].map((t) => (
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
                <p className="mt-0.5 text-[11px] text-muted-foreground">按随访阶段自动推送</p>
              </div>
              <Badge variant="destructive" className="h-5">{todos.length} 待办</Badge>
            </div>
          </Card>

          {todos.map((s) => (
            <Card key={s.stage} className="overflow-hidden">
              <div className={`flex items-center justify-between border-b px-4 py-2 ${s.color.split(" ").slice(0, 2).join(" ")}`}>
                <span className="text-xs font-semibold">{s.stage}</span>
                <Badge variant="outline" className="h-4 border-current text-[10px]">{s.todos.length} 项</Badge>
              </div>
              <div className="divide-y">
                {s.todos.map((t, i) => (
                  <div key={i} className="px-4 py-3">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.patient}</p>
                    <p className="mt-1 truncate text-[11px] text-foreground/70">📖 {t.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">截止 {t.due}</span>
                      <Button size="sm" className="h-7 bg-gradient-community text-xs" onClick={() => toast({ title: "已推送", description: t.title })}>
                        <Send className="mr-1 h-3 w-3" />立即推送
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </>
      )}

      {tab === "library" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-accent/10 to-transparent px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">宣教库</h3>
            </div>
            <Badge className="h-5 bg-accent text-accent-foreground">社区版</Badge>
          </div>
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索宣教内容" className="h-8 pl-8 text-xs" />
            </div>
          </div>
          <div className="divide-y">
            {library.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Play className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">{c.category} · {c.duration}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-accent" onClick={() => setTarget(c)}>
                  推送
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ActionSheet
        open={!!target}
        onOpenChange={(v) => !v && setTarget(null)}
        title="选择推送对象"
        description={target?.title}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setTarget(null)}>取消</Button>
            <Button className="bg-gradient-community" onClick={() => { toast({ title: "已推送", description: target?.title }); setTarget(null); }}>
              <Send className="mr-1 h-4 w-4" />确认推送
            </Button>
          </div>
        }
      >
        <div className="space-y-2 py-2 text-xs">
          {[
            { name: "糖尿病随访组", count: 24 },
            { name: "甲状腺随访组", count: 18 },
            { name: "新建档患者", count: 3 },
          ].map((g) => (
            <div key={g.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span className="font-medium">{g.name}</span>
              </div>
              <span className="text-muted-foreground">{g.count} 人</span>
            </div>
          ))}
        </div>
      </ActionSheet>
    </div>
  );
};

export default CommunityEducation;
