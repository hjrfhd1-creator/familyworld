import { Link } from "react-router-dom";
import { HeartPulse, ArrowRight, Activity, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-secondary/30">
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">智慧医护平台</span>
        </div>
        <span className="text-sm text-muted-foreground">v1.0</span>
      </header>

      <main className="container mx-auto px-4 pb-16 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            选择您的工作角色
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            为医生与护士提供差异化的工作流支持,提升日常协作效率
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            to="/nurse"
            className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-gradient-nurse opacity-10 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-nurse text-primary-foreground shadow-soft">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-semibold">护士端小程序</h2>
              <p className="mt-2 text-muted-foreground">
                工作台、护理方案审核、任务监控、出院转交、健康宣教
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />今日待办与紧急求助</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />AI 护理方案一键审核</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />出院交接与宣教推送</li>
              </ul>
              <Button className="mt-8 w-full bg-gradient-nurse hover:opacity-90">
                进入护士端 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Link>

          <Link
            to="/community"
            className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-gradient-community opacity-10 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-community text-primary-foreground shadow-soft">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-semibold">社区端小程序</h2>
              <p className="mt-2 text-muted-foreground">
                接收下转患者、随访任务、血糖血压录入与一键上转
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" />医院下转患者档案</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" />核心数据采集与异常预警</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" />一键上转 + 消息通知</li>
              </ul>
              <Button className="mt-8 w-full bg-gradient-community hover:opacity-90">
                进入社区端 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
