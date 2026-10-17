import { FloatingActions } from "@/components/floating";
import { Assessment, Steps } from "@/components/sections/assessment";
import { CareerExplorer } from "@/components/sections/career-explorer";
import { FinalCta, Footer } from "@/components/sections/closing";
import { Conversation } from "@/components/sections/conversation";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Mentor } from "@/components/sections/mentor";
import { Receive } from "@/components/sections/receive";
import { Report } from "@/components/sections/report";
import { Rewards } from "@/components/sections/rewards";
import { Counselling } from "@/components/sections/support";
import { Videos } from "@/components/sections/videos";

export default function Home() {
  return (
    <main>
      <Hero />
      <Conversation />
      <Receive />
      <CareerExplorer />
      <Videos />
      <Mentor />
      <Assessment />
      <Steps />
      <Report />
      <Counselling />
      <Rewards />
      <Faq />
      <FinalCta />
      <Footer />
      <FloatingActions />
    </main>
  );
}
