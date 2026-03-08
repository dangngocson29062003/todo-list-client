import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/accordion";
import { Badge } from "../shadcn/badge";

interface FeatureItem {
  value: string;
  title: string;
  description: string;
  isNew?: boolean;
}

export function FeatureItem({ value, title, description, isNew }: FeatureItem) {
  return (
    <AccordionItem
      value={value}
      className="hover:bg-(--border) data-[state=open]:bg-transparent"
    >
      <AccordionTrigger className="text-lg text-black dark:text-white px-4 py-3 transition-colors no-underline! ">
        <div className="flex items-center gap-2">
          {title}
          {isNew && (
            <Badge className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-500 dark:text-orange-100">
              New
            </Badge>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-3">{description}</AccordionContent>
    </AccordionItem>
  );
}
