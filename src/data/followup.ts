export type FollowupStatus = "待随访" | "需复访" | "已完成";

export type FollowupPatient = {
  id: number;
  name: string;
  status: FollowupStatus;
  surgery: string; // 沿用字段:展示主要诊断/复诊事项
  postOpDay?: number; // 沿用字段:出院后天数
  note?: string;
};

export const followupList: FollowupPatient[] = [
  { id: 11, name: "韩启航", status: "待随访", surgery: "2 型糖尿病 · 出院后血糖监测", postOpDay: 3 },
  { id: 12, name: "王晓彤", status: "待随访", surgery: "Graves 甲亢 · 甲功复查随访", postOpDay: 5 },
  { id: 13, name: "杨成轩", status: "待随访", surgery: "甲状腺次全切术后 · 钙片与左甲状腺素调整", postOpDay: 7 },
  { id: 14, name: "胡国玉", status: "待随访", surgery: "胰岛素泵剂量滴定 · 出院 9 天", postOpDay: 9 },
  { id: 15, name: "何宗兰", status: "已完成", surgery: "桥本甲状腺炎 · TSH 已达标,继续维持", postOpDay: 14 },
  { id: 16, name: "范芳进", status: "需复访", surgery: "糖尿病酮症酸中毒康复期 · 建议复诊", postOpDay: 21 },
];

export const followupStats = () => {
  const c = (s: FollowupStatus) => followupList.filter((p) => p.status === s).length;
  return {
    total: followupList.length,
    pending: c("待随访"),
    recheck: c("需复访"),
    done: c("已完成"),
  };
};
