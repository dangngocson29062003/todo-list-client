import { Card } from "../shadcn/card";
import { motion } from "framer-motion";
interface FeatureCardProps {
  title: string;
  desc: string;
  image?: string;
  active?: boolean;
  onClick?: () => void;
}

export function FeatureCard({
  title,
  desc,
  image,
  active,
  onClick,
}: FeatureCardProps) {
  return (
    <motion.div
      onClick={onClick}
      animate={{
        flex: active ? 4 : 1,
      }}
      transition={{ duration: 0.6 }}
      className="min-w-[200px] min-h-[40rem] text-start cursor-pointer"
    >
      <div className="w-full h-[30rem] overflow-hidden relative rounded-2xl bg-yellow-100 text-yellow-700 dark:bg-yellow-300 dark:text-yellow-300">
        <div className="absolute w-[1000px] h-full flex-1 top-10 left-10 hidden xl:block overflow-visible">
          <img
            src={image}
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

      <h3 className="mt-4 font-bold">{title}</h3>
      {active && <p className="text-sm text-(--muted-foreground)">{desc}</p>}
    </motion.div>
  );
}
