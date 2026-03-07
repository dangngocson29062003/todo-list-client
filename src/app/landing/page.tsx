"use client";
import { FeatureCard } from "@/src/components/landing/featureCard";
import Footer from "@/src/components/landing/footer";
import Header from "@/src/components/landing/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/shadcn/accordion";
import { Badge } from "@/src/components/shadcn/badge";
import { Button } from "@/src/components/shadcn/button";
import { Tabs, TabsContent, TabsList } from "@/src/components/shadcn/tabs";
import Typeanimation from "@/src/components/shadcn/typeanimation";
import { BadgeCheck, MoveRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
const features = [
  {
    title: "Create Project",
    desc: "Start a new project and organize your ideas into tasks and subtasks.",
    image: "images/image2.png",
  },
  {
    title: "Invite Member",
    desc: "Invite teammates to collaborate and communicate in real time.",
    image: "images/image2.png",
  },
  {
    title: "Manage Tasks",
    desc: "Track progress and stay productive with your team.",
    image: "images/image2.png",
  },
  {
    title: "Chatting",
    desc: "Chat with your team instantly inside the project workspace.",
    image: "images/image2.png",
  },
];
export default function LandingPage() {
  const { theme } = useTheme();
  const [tab, setTab] = useState("chatting");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      <Header />
      <div className="w-full flex flex-col items-center pb-4 justify-center mx-auto">
        <div className="w-full min-h-[30rem] md:min-h-[50rem] relative overflow-hidden flex items-center justify-center gap-10">
          {theme === "dark" && (
            <>
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(0,255,200,0.18),transparent)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
              </div>

              <div className="absolute bottom-0 left-0 w-full h-20 md:h-40 bg-gradient-to-b from-transparent to-background" />
            </>
          )}
          <div className="max-w-7xl w-full flex flex-col gap-2 justify-start">
            <h2 className="text-3xl font-bold leading-tight text-center xl:text-start">
              Build products faster with your team
            </h2>
            <Typeanimation
              words={["Plan", "Collaborate", "Deliver"]}
              typingSpeed="slow"
              deletingSpeed="slow"
              pauseDuration={2000}
              className="text-3xl md:text-5xl font-extrabold text-teal-600 text-center xl:text-start"
            />
            <p className="text-gray-400 text-lg mt-4 xl:max-w-md leading-relaxed text-center xl:text-start">
              Join modern teams who use Weaver to organize tasks, collaborate
              seamlessly, and deliver projects faster.
            </p>
            <div className="flex mt-5 gap-4 justify-center xl:justify-start">
              <Button size="lg">Get started free</Button>
              <Link href="#features">
                <Button variant="secondary" size="lg">
                  See Features
                </Button>
              </Link>
            </div>
            <div className="flex mt-5 gap-2 flex-wrap xl:gap-4 justify-center xl:justify-start">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <BadgeCheck />
                No credit card required
              </Badge>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                <BadgeCheck />
                Free plan available
              </Badge>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                <BadgeCheck />
                Cancel anytime
              </Badge>
            </div>
          </div>
          <div className="absolute top-20 right-0 -z-10 hidden xl:block overflow-visible">
            <img
              src="/images/image1.png"
              alt="App preview"
              className="
                      relative
                      xl: w-[750px]
                      2xl:w-[950px]
                      rounded-2xl
                      shadow-2xl
                      border
                    "
            />
          </div>
        </div>

        <section className="max-w-[90rem] w-full px-6 py-28" id="features">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4">Our Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Powerful tools for your workflow
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Everything you need to manage projects, analyze performance, and
              collaborate with your team.
            </p>
          </div>

          <Tabs
            defaultValue="chatting"
            value={tab}
            onValueChange={setTab}
            orientation="vertical"
            className="grid grid-cols-[1fr] xl:grid-cols-[550px_1fr] w-full min-h-[500px] gap-0 shadow-lg rounded-2xl overflow-hidden bg-background/60 backdrop-blur"
          >
            <TabsList className="flex flex-col h-full! w-full gap-15 items-start rounded-r-none p-6">
              <Link href="#">
                <h2 className="font-semibold text-black dark:text-white">
                  Our powerful features help teams stay organized and deliver
                  projects on time.
                </h2>
                <Button className="mt-5">
                  Get Started
                  <MoveRightIcon className="font-bold" />
                </Button>
              </Link>

              <div className="flex flex-col h-full w-full ">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="shipping"
                  className="w-full"
                  value={tab}
                  onValueChange={(value) =>
                    value !== "" ? setTab(value) : setTab((prev) => prev)
                  }
                >
                  <AccordionItem value="chatting">
                    <AccordionTrigger className="text-lg text-black dark:text-white">
                      Chatting
                    </AccordionTrigger>
                    <AccordionContent>
                      Real-time team communication.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="project">
                    <AccordionTrigger className="text-lg text-black dark:text-white">
                      Project
                    </AccordionTrigger>
                    <AccordionContent>
                      Manage projects in one place.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="task">
                    <AccordionTrigger className="text-lg text-black dark:text-white">
                      Task
                    </AccordionTrigger>
                    <AccordionContent>
                      Organize work with tasks and subtasks.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notification">
                    <AccordionTrigger className="text-lg text-black dark:text-white">
                      Team & Notification
                    </AccordionTrigger>
                    <AccordionContent>
                      Stay updated and manage your team.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsList>
            <div className="hidden xl:block">
              <TabsContent value="chatting" className="w-full h-full">
                <div className="w-full h-full relative bg-orange-100 text-orange-700 dark:bg-orange-500 dark:text-orange-300">
                  <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden xl:block overflow-visible">
                    <img
                      src="/images/image2.png"
                      alt="App preview"
                      className="
                    relative
                    w-[1000px]
                    rounded-2xl
                    rounded-r-none
                  "
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="task" className="w-full h-full">
                <div className="w-full h-full relative bg-green-100 text-green-700 dark:bg-green-500 dark:text-green-300">
                  <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden xl:block overflow-visible">
                    <img
                      src="/images/image2.png"
                      alt="App preview"
                      className="
                    relative
                    w-[1000px]
                    rounded-2xl
                    rounded-r-none
                  "
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="project" className="w-full h-full">
                <div className="w-full h-full relative  bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-blue-300">
                  <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden xl:block overflow-visible">
                    <img
                      src="/images/image2.png"
                      alt="App preview"
                      className="
                    relative
                    w-[1000px]
                    rounded-2xl
                    rounded-r-none
                  "
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notification" className="w-full h-full">
                <div className="w-full h-full relative bg-purple-100 text-purple-700 dark:bg-purple-500 dark:text-purple-300">
                  <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden xl:block overflow-visible">
                    <img
                      src="/images/image2.png"
                      alt="App preview"
                      className="
                    relative
                    w-[1000px]
                    rounded-2xl
                    rounded-r-none
                  "
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </section>
        <section className="max-w-[90rem] w-full px-6 py-28">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Simple process, powerful results
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Get started in minutes and see improved team productivity
            </p>
          </div>
          <div className="w-full mx-auto">
            <div className="flex gap-6 flex-col md:flex-row">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  onClick={() => setActive(index)}
                  active={index === active}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="w-full px-6 py-28 bg-blue-200 dark:bg-blue-800 gap-5 flex flex-col justify-center items-center text-center">
          <div>
            <h3 className="text-3xl font-bold mb-5">
              Ready to boost your team's productivity?
            </h3>
            <p className="text-md font-semi text-(--muted-foreground)">
              Join thousands of teams that use WEAVER to get more done,
              together.
            </p>
          </div>
          <div className="flex gap-5">
            <Button size="lg">Get Start Free</Button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
