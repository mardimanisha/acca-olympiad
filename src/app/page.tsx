import { FloatingActions } from "@/components/floating";
import { Assessment, Steps } from "@/components/sections/assessment";
import { FinalCta, Footer } from "@/components/sections/closing";
import { Conversation } from "@/components/sections/conversation";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { TopBar } from "@/components/top-bar";
import { Mentor } from "@/components/sections/mentor";
import { Rewards } from "@/components/sections/rewards";
import { Counselling } from "@/components/sections/support";
import { Videos } from "@/components/sections/videos";

export default function Home() {
  return (
    <main>
      <TopBar />
      <Hero />
      <Conversation />
      <Assessment />
      <Steps />
      <Mentor />
      <Rewards />
      <Videos />
      <Counselling />
      <FinalCta />
      <Faq />
      <Footer />
      <FloatingActions />
    </main>
  );
}
