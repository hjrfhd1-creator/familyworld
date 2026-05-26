import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ChatScreen, { ChatMsg, ChatPeer } from "@/components/chat/ChatScreen";

const seedByDoctor: ChatMsg[] = [
  { id: 1, from: "them", text: "李护士,0312床的血糖情况如何?", time: "09:12", type: "text" },
  { id: 2, from: "me", text: "王主任,刚刚复测随机血糖 16.8 mmol/L,仍偏高。", time: "09:13", type: "text" },
  { id: 3, from: "them", text: "请加测一次尿酮体,并预约今晚胰岛素剂量调整。", time: "09:14", type: "text" },
  { id: 4, from: "me", text: "好的,10 分钟后采样并回报。", time: "09:14", type: "text" },
];

const seedByPatient: ChatMsg[] = [
  { id: 1, from: "them", text: "护士,我有点心慌出汗,是不是低血糖了?", time: "09:30", type: "text" },
  { id: 2, from: "me", text: "您先吃 15g 糖块或半杯果汁,我马上过来测血糖。", time: "09:31", type: "text" },
  { id: 3, from: "them", text: "好的谢谢。", time: "09:31", type: "text" },
];

const NurseChat = () => {
  const { type = "doctor" } = useParams();
  const isDoctor = type === "doctor";

  const peer: ChatPeer = useMemo(() => {
    if (isDoctor) return { name: "王主任", sub: "内分泌科 · 主治医师", phone: "13800138001", isDoctor: true };
    return {
      name: "张伟",
      sub: "床位 0312 · 58岁 · 男",
      phone: "13800138888",
      isDoctor: false,
      abnormal: true,
      diagnosis: "2 型糖尿病 · 酮症倾向 · 过敏:青霉素",
      vitals: [
        { label: "随机血糖", value: "16.8", abnormal: true },
        { label: "糖化", value: "9.2%" },
        { label: "血压", value: "138/86" },
      ],
    };
  }, [isDoctor]);

  return (
    <ChatScreen
      peer={peer}
      initialMessages={isDoctor ? seedByDoctor : seedByPatient}
      gradientClass="bg-gradient-nurse"
    />
  );
};

export default NurseChat;
