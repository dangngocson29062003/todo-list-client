"use client";
import Header from "@/src/components/landing/header";
import { Badge } from "@/src/components/shadcn/badge";
import { Button } from "@/src/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/shadcn/tabs";
import Typeanimation from "@/src/components/shadcn/typeanimation";
import { BadgeCheck } from "lucide-react";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme } = useTheme();
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
              <Button size="lg">Try for free</Button>
              <Button variant="secondary" size="lg">
                See Features
              </Button>
            </div>
            <div className="flex mt-5 gap-4 justify-center xl:justify-start">
              <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <BadgeCheck />
                No credit card required
              </Badge>
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                <BadgeCheck />
                Free plan available
              </Badge>
              <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                <BadgeCheck />
                Cancel anytime
              </Badge>
            </div>
          </div>
          <div className="absolute top-20 right-0 -z-10 hidden 2xl:block overflow-visible">
            <img
              src="/images/image1.png"
              alt="App preview"
              className="
                    relative
                    w-[1000px]
                    rounded-2xl
                    shadow-2xl
                    border
                  "
            />
          </div>
        </div>

        <section className="max-w-[90rem] w-full px-6 py-28">
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
            orientation="vertical"
            className="grid grid-cols-[1fr_1fr] w-full gap-0 shadow-lg rounded-2xl overflow-hidden"
          >
            <TabsList className="flex flex-col h-full w-full gap-20 rounded-r-none p-6 bg-background/60 backdrop-blur">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
              dolor adipisci omnis aut cumque, obcaecati, delectus expedita
              eaque, sed ratione quo neque unde quis tempore labore molestias
              animi itaque rerum.
              <div className="flex flex-col h-full w-full ">
                <TabsTrigger className="justify-center py-4" value="chatting">
                  Chatting
                </TabsTrigger>
                <TabsTrigger className="justify-start py-4" value="task">
                  Task
                </TabsTrigger>
                <TabsTrigger className="justify-start py-4" value="project">
                  Project
                </TabsTrigger>
                <TabsTrigger
                  className="justify-start py-4"
                  value="notification"
                >
                  Notification
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value="chatting">
              <div className="w-full h-full relative bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden 2xl:block overflow-visible">
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
            <TabsContent value="task">
              <div className="w-full h-full relative bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden 2xl:block overflow-visible">
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
            <TabsContent value="project">
              <div className="w-full h-full relative  bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden 2xl:block overflow-visible">
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
            <TabsContent value="notification">
              <div className="w-full h-full relative bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <div className="absolute w-[1000px] flex-1 top-10 left-10 hidden 2xl:block overflow-visible">
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
          </Tabs>
        </section>
      </div>
    </div>
  );
}
