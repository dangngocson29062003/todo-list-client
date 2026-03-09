import { ArrowRightCircle, Clock, File, FilePlus, PlusCircle } from "lucide-react";
import { Card, CardHeader } from "../shadcn/card";

export default function RecentlyItem({user, date, title, category, isCreate} : {user?: string, date?: string, title?: string, category?: string, isCreate?: boolean}) {
    if(isCreate) {
        return (
            <div className="w-full relative max-w-46 h-40 border-2 border-dashed rounded-sm border-gray-300 mt-4 cursor-pointer group hover:border-green-600 hover:shadow-md transition-all duration-200">
                {/* Title */}
                <div className="p-3 flex flex-col gap-2 mt-2">
                    <div className="flex items-start gap-2">
                        <div>
                            <FilePlus className="h-5 w-5 text-gray-500 group-hover:text-green-600 mt-0.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate group-hover:text-green-600 transition-all">
                                Create
                            </span>

                            <span className="text-xs text-gray-400 mt-1">
                                Create a new project, task or workspace
                                or anything you want.
                            </span>
                        </div>
                    </div>
                    
                </div>
                <div className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 absolute bottom-3 right-3 text-green-600 transition"><PlusCircle className="h-5 w-5"/></div>
            </div>
        );
    }
    return (
    <div className="w-full relative max-w-46 h-40 border-2 rounded-sm border-gray-300 mt-4 cursor-pointer group hover:border-blue-600 hover:shadow-md transition-all duration-200">
        <div className="flex border-b text-xs justify-between py-2 px-2 items-center">
            <div className="flex items-center gap-1 min-w-0">
                <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    D
                </div>
                <span className="truncate w-full">
                    {user}
                </span>
            </div>
            <span className="text-gray-400">{date}</span>
        </div>
        {/* Title */}
        <div className="p-3 flex flex-col gap-2 mt-2">
            <div className="flex items-start gap-2">
                <div>
                    <File className="h-5 w-5 text-gray-500 mt-0.5" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                        {title}
                    </span>

                    <span className="text-xs text-gray-400 mt-1 truncate">
                        {category}
                    </span>
                </div>
            </div>
            
        </div>
        <div className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 absolute bottom-3 right-3 text-blue-600 transition"><ArrowRightCircle className="h-5 w-5"/></div>
    </div>
    );
}