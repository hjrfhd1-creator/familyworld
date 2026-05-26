export type EduContent = {
  id: number;
  title: string;
  category: string;
  duration: string;
  desc?: string;
};

export const eduLibrary: EduContent[] = [
  { id: 1, title: "糖尿病饮食指南", category: "糖尿病", duration: "6 min", desc: "三餐搭配、升糖指数与加餐建议。" },
  { id: 2, title: "胰岛素注射规范", category: "糖尿病", duration: "3 min", desc: "标准注射部位轮换、剂量核对与低血糖应急。" },
  { id: 3, title: "低血糖识别与处理", category: "糖尿病", duration: "4 min", desc: "低血糖征兆识别、15-15 法则与家属配合。" },
  { id: 4, title: "家庭血糖监测要点", category: "糖尿病", duration: "5 min", desc: "指尖血糖采集、记录与异常上报。" },
  { id: 5, title: "甲亢患者饮食与作息", category: "甲状腺", duration: "5 min", desc: "低碘饮食、避免诱因与情绪管理。" },
  { id: 6, title: "甲减用药依从性", category: "甲状腺", duration: "4 min", desc: "左甲状腺素空腹服用、复查节奏与剂量调整。" },
  { id: 7, title: "出院后内分泌随访", category: "通用", duration: "8 min", desc: "复诊节奏、化验单解读与社区随访衔接。" },
];

export const eduByCategory = (): Record<string, EduContent[]> => {
  return eduLibrary.reduce((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {} as Record<string, EduContent[]>);
};
