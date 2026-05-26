import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Send, Phone, Mic, Stethoscope, User, MoreVertical, Sparkles,
  RefreshCw, FileText, X, Hospital,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export type ChatMsg = {
  id: number;
  from: "me" | "them";
  text?: string;
  type?: "text" | "vitals";
  time: string;
  meta?: string;
};

export type ChatPeer = {
  name: string;
  sub: string;
  phone: string;
  isDoctor: boolean;
  abnormal?: boolean;
  diagnosis?: string;
  vitals?: { label: string; value: string; abnormal?: boolean }[];
};

interface Props {
  peer: ChatPeer;
  initialMessages: ChatMsg[];
  /** gradient class for header & send button, e.g. "bg-gradient-nurse" */
  gradientClass?: string;
  /** suggested AI draft to show in the input area */
  aiDraft?: string;
  planUnread?: number;
  onArchive?: () => void;
  onPlan?: () => void;
  showPlan?: boolean;
  showReferral?: boolean;
  onReferral?: () => void;
}

const ChatScreen = ({
  peer,
  initialMessages,
  gradientClass = "bg-gradient-nurse",
  aiDraft = "您好，目前您提供的基本信息不完整（如年龄、身高），但体重60kg若身高在165-175cm区间，属正常范围。建议您：1) 定期监测体重与体脂，保持BMI在18.5-23.9；2) 均衡饮食，增加蔬菜...",
  planUnread = 1,
  onArchive,
  onPlan,
  showPlan = false,
  showReferral = false,
  onReferral,
}: Props) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [aiOn, setAiOn] = useState(true);
  const [draft, setDraft] = useState<string | null>(aiDraft);
  const [recording, setRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text?: string) => {
    const value = (text ?? draft ?? "").trim();
    if (!value) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: value, time, type: "text" }]);
    setDraft(null);
  };

  const regenerate = () => {
    if (!aiOn) {
      toast({ title: "请先开启 AI 智能回复" });
      return;
    }
    toast({ title: "AI 已重新生成草稿" });
    setDraft(
      "感谢您的反馈。建议每日定时监测，注意低盐低脂饮食，每周 3-5 次 30 分钟有氧运动。如有不适请及时复诊。",
    );
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className={`sticky top-0 z-30 flex items-center justify-between border-b ${gradientClass} px-3 py-2.5 text-primary-foreground`}>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            {peer.isDoctor ? <Stethoscope className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{peer.name}</p>
            <p className="text-[11px] opacity-80">{peer.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toast({ title: "正在呼叫", description: `${peer.name} · ${peer.phone}` })}
            className="rounded-full p-1.5 hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded-full p-1.5 hover:bg-white/10">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Patient banner */}
      {!peer.isDoctor && peer.diagnosis && (
        <div className="border-b bg-card px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">主诉</span>
            {peer.abnormal && <Badge variant="destructive" className="h-4 px-1 text-[10px]">异常</Badge>}
          </div>
          <p className="mt-1 text-xs">{peer.diagnosis}</p>
          {peer.vitals && (
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
              {peer.vitals.map((v) => (
                <div key={v.label} className={`rounded px-2 py-1 text-center ${v.abnormal ? "bg-destructive/10" : "bg-muted"}`}>
                  <p className="text-muted-foreground">{v.label}</p>
                  <p className={`font-semibold ${v.abnormal ? "text-destructive" : ""}`}>{v.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        <p className="text-center text-[10px] text-muted-foreground">今日 {messages[0]?.time}</p>
        {messages.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            {m.from === "them" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                {peer.isDoctor ? <Stethoscope className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
              </div>
            )}
            <div className={`max-w-[75%] flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}>
              {m.type === "vitals" ? (
                <div className="rounded-2xl border bg-card p-3 text-xs shadow-soft">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-accent">体征快照</p>
                  <p className="font-medium">{m.text}</p>
                  {m.meta && <p className="mt-1 text-[10px] text-muted-foreground">{m.meta}</p>}
                </div>
              ) : (
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-snug ${
                    m.from === "me" ? `${gradientClass} text-primary-foreground` : "bg-card text-foreground shadow-soft"
                  }`}
                >
                  {m.text}
                </div>
              )}
              <span className="mt-1 text-[10px] text-muted-foreground">{m.time}</span>
            </div>
            {m.from === "me" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* === Input toolbar (统一样式) === */}
      <div className="sticky bottom-0 border-t bg-card px-3 pb-3 pt-2">
        {/* 工具栏:AI开 / refresh ... 档案 / 方案 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiOn((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                aiOn ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />AI{aiOn ? "开" : "关"}
            </button>
            <button
              onClick={regenerate}
              className="flex h-7 w-7 items-center justify-center rounded-full text-primary hover:bg-primary/10"
              aria-label="重新生成"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onArchive ?? (() => toast({ title: "查看患者档案" }))}
              className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              <User className="h-3.5 w-3.5" />档案
            </button>
            {showPlan && (
              <button
                onClick={onPlan ?? (() => toast({ title: "查看护理方案" }))}
                className="relative flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                <FileText className="h-3.5 w-3.5" />方案
                {planUnread > 0 && (
                  <span className="ml-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {planUnread}
                  </span>
                )}
              </button>
            )}
            {showReferral && (
              <button
                onClick={onReferral ?? (() => {
                  toast({ title: "已发起转诊", description: "正在跳转至鼓楼互联网医院..." });
                  setTimeout(() => window.open("https://www.njglyy.com/", "_blank"), 600);
                })}
                className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Hospital className="h-3.5 w-3.5" />转诊
              </button>
            )}
          </div>
        </div>

        {/* 草稿/输入区 + 麦克风/发送 */}
        <div className="mt-2 flex items-end gap-2">
          <div className="relative min-h-[64px] flex-1 rounded-xl border border-primary/20 bg-primary/5 p-2.5 pr-7">
            {draft ? (
              <>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">{draft}</p>
                <button
                  onClick={() => setDraft(null)}
                  className="absolute right-1.5 top-1.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted"
                  aria-label="清除草稿"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <textarea
                autoFocus
                placeholder={aiOn ? "等待 AI 生成草稿，或直接输入..." : "输入消息..."}
                onChange={(e) => setDraft(e.target.value)}
                className="h-full min-h-[44px] w-full resize-none bg-transparent text-xs leading-relaxed outline-none placeholder:text-muted-foreground/60"
              />
            )}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => {
                setRecording((r) => !r);
                toast({ title: recording ? "已停止录音" : "开始录音" });
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                recording ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-label="语音"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={() => send()}
              disabled={!draft?.trim()}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground shadow-soft transition-opacity ${gradientClass} ${
                !draft?.trim() ? "opacity-40" : "hover:opacity-90"
              }`}
              aria-label="发送"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
