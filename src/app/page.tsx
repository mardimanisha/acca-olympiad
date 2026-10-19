import { FloatingActions } from "@/components/floating";
import { Assessment, Steps } from "@/components/sections/assessment";
import { FinalCta, Footer } from "@/components/sections/closing";
import { Conversation } from "@/components/sections/conversation";
import { CareerExplorer } from "@/components/sections/career-explorer";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { TopBar } from "@/components/top-bar";
import { Mentor } from "@/components/sections/mentor";
import { Receive } from "@/components/sections/receive";
import { Counselling } from "@/components/sections/support";
import { Videos } from "@/components/sections/videos";

export default function Home() {
  return (
    <main>
      <TopBar />
      <Hero />
      <Conversation />
      <CareerExplorer />
      <Assessment />
      <Steps />
      <Mentor />
      <Receive />
      <Videos />
      <Counselling />
      <FinalCta />
      <Faq />
      <Footer />
      <FloatingActions />
    </main>
  );
}
