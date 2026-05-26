# Project Memory

## Core
Medical UI: blue/cyan tones; community端使用 emerald/teal 渐变 (gradient-community)。
Triple-role architecture: Doctor / Nurse / Community terminals; use homepage switcher.
Nurse & Community terminals are mobile-first mini-programs wrapped in iPhone phone-shell.
All popups stay inside the 480px frame (in-frame ActionSheet), never gray out the whole page.
护士端不再有"护理方案"模块,核心工作=基于医生健康方案生成待办/宣教/出院下转。
所有患者列表(护士端+社区端)必须显示来源渠道:南京市鼓楼医院 或 兰园社区。
社区端"上传至鼓楼医院"是单患者操作,上传成功后优先推荐鼓楼医院互联网医院入口。

## Memories
- [Medical Theme UI](mem://style/theme) — Medical theme using blue/cyan tones
- [Dual-Role Architecture](mem://architecture/roles) — Doctor / Nurse / Community 三端,首页切换
- [Doctor Workstation](mem://features/doctor-workstation) — Core clinical shortcuts, queue management, and prescribing
- [Nurse Mini-Program](mem://features/nurse-mini-program) — Mobile-first nurse terminal with task and education management
- [Community Mini-Program](mem://features/community-mini-program) — 社区端:接收下转患者、随访看板、单患者上传至鼓楼医院、消息通知
