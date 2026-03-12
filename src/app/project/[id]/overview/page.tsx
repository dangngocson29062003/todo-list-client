"use client";

import { Calendar, ClockIcon, PlusCircleIcon, TriangleAlertIcon, User, User2, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { Progress } from "@/src/components/shadcn/progress";

export default function WorkspacePage() {
    const params = useParams();
    const { id } = params;

    const project = {
        name: "Project Name",
        description: "This is a sample project description. You can replace this with actual project details. It can include information about the project's goals, timeline, and any other relevant details.  This description is meant to give an overview of the project and its objectives.  You can expand this description to include more specific information about the project, such as its scope, deliverables, and any important milestones.  The project description should provide a clear understanding of what the project is about and what it aims to achieve.",
        id: id,
        active: true,
        assignedToMe: true,
        createdAt: "2025-12-26T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        finishedAt: "2026-03-25T00:00:00Z",
        createdBy: "User ID",
        createdByNickname: "User Nickname",
        createdByEmail: "user@example.com",
        createdByAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        priority: "High",
        label: "Frontend", // Added label for Backlog section
        members: [{
            id: "Member ID 1",
            email: "member1@email.com",
            avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: "Member ID 2",
            email: "member2@email.com",
            avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            id: "Member ID 3",
            email: "member3@email.com",
            avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        }, {
            id: "Member ID 4",
            email: "member4@email.com",
            avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        }],

        tasks: [{
            id: "1",
            name: "Task 1",
            description: "Task 1 Description",
            taskType: "Feature",
            taskStatus: "To Do",
            startedAt: "2024-01-01T00:00:00Z",
            finishedAt: "2024-01-01T00:00:00Z",
            priority: "Normal",
            assignees: [{
                userId: "User ID 1",
                nickname: "User 1",
                email: "user1@example.com",
                avatar: "https://example.com/avatar1.jpg",
                assignedAt: "2024-01-01T00:00:00Z",
                assignedBy: "User ID",
            },
            {
                userId: "User ID 2",
                nickname: "User 2",
                email: "user2@example.com",
                avatar: "https://example.com/avatar2.jpg",
                assignedAt: "2024-01-01T00:00:00Z",
                assignedBy: "User ID",
            }]
        }],
        messages: [{
            id: "1",
            content: "Message content",
            createdAt: "2024-01-01T00:00:00Z",
            createdBy: "User ID",
            createdByNickname: "User Nickname",
            createdByEmail: "user@example.com",
            createdByAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: "2",
            content: "Message content 2",
            createdAt: "2024-01-01T00:00:00Z",
            createdBy: "User ID",
            createdByNickname: "User Nickname",
            createdByEmail: "user@example.com",
            createdByAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        }],
        files: [{
            id: "1",
            name: "project-document.pdf",
            size: "2.5 MB",
            uploadedAt: "2024-01-01T00:00:00Z",
            uploadedBy: "User Nickname",
            uploadedByAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: "2",
            name: "design-mockups.figma",
            size: "5.2 MB",
            uploadedAt: "2024-01-02T00:00:00Z",
            uploadedBy: "User Nickname",
            uploadedByAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        }]
    }

    return (
        <div className="p-1 flex h-full">
            <div className="px-5 flex-3 border-r-2">
                <h1 className=" font-semibold">
                    Description
                </h1>
                <p className="p-2 text-gray-500 dark:text-gray-400">
                    {project.description}
                </p>
            </div>

            <div className="flex-1 flex flex-col gap-2 px-5">
                <div className="flex flex-col gap-2">
                    <h1 className=" font-semibold">Time</h1>

                    <div className="flex flex-col gap-2 mb-2 text-sm">

                        {project.finishedAt && (
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex gap-2 text-gray-500 dark:text-gray-400 items-center">
                                    <ClockIcon className="h-4 w-4" />
                                    <p>Estimate</p>
                                </div>

                                <p className="text-gray-800 dark:text-gray-200">
                                    {(() => {
                                        const diff =
                                            new Date(project.finishedAt).getTime() -
                                            new Date(project.createdAt).getTime();

                                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                        const months = Math.floor(days / 30);
                                        const remainingDays = days % 30;

                                        if (months === 0) return `${remainingDays} days`;
                                        return `${months}m ${remainingDays}d`;
                                    })()}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex gap-2 text-gray-500 dark:text-gray-400 items-center">
                                <Calendar className="h-4 w-4" />
                                <p>Due date</p>
                            </div>

                            <p className="text-gray-800 dark:text-gray-200">
                                {project.finishedAt
                                    ? new Date(project.finishedAt).toDateString()
                                    : "Unknown"}
                            </p>
                        </div>

                        {project.finishedAt && (
                            <div className="mt-2">
                                <div className="grid grid-cols-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <p>Day remaining</p>

                                    <p className="text-gray-500 dark:text-gray-400 text-right">
                                        {(() => {
                                            const diff =
                                                new Date(project.finishedAt).getTime() - Date.now();

                                            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                            const months = Math.floor(days / 30);
                                            const remainingDays = days % 30;

                                            if (months === 0)
                                                return days > 0 ? `${remainingDays} days to go` : "Overdue";

                                            if (days > 0)
                                                return `${months} months ${remainingDays} days to go`;

                                            return "Overdue";
                                        })()}
                                    </p>
                                </div>

                                <Progress
                                    className="mt-2 bg-gray-200 dark:bg-gray-700"
                                    value={Math.max(
                                        0,
                                        (Date.now() - new Date(project.createdAt).getTime()) /
                                        (new Date(project.finishedAt).getTime() -
                                            new Date(project.createdAt).getTime())) * 100
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold">Backlog</h1>
                    <div className="flex flex-col gap-1">
                        <div className="grid grid-cols-2 gap-5 text-sm">
                            <div className="flex gap-2 text-gray-500 dark:text-gray-400 items-center">
                                <User2 className="h-4 w-4 rounded-full border border-white dark:border-gray-900" />
                                <p>Creator</p>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200">
                                <img src={project.createdByAvatar} alt={project.createdByEmail} className="h-6 w-6 rounded-full border border-white dark:border-gray-900"
                                    title={project.createdByEmail} />
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-5 text-sm">
                            <div className="flex gap-2 text-gray-500 dark:text-gray-400 items-center">
                                <Users className="h-4 w-4" />
                                <p>Members</p>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 flex ">
                                {project.members && (project.members.slice(0, 3).map(member =>
                                    <img src={member.avatarUrl} alt={member.email} className="h-6 w-6 rounded-full border border-white dark:border-gray-900 -ml-2 first:ml-0"
                                        title={member.email} />
                                ))}
                                {project.members && project.members.length > 3 && (
                                    <div
                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-medium text-gray-700 dark:text-gray-200 -ml-2 ring-2 ring-white dark:ring-gray-900 select-none"
                                        title={`${project.members.length - 3} more members`}
                                    >
                                        +{project.members.length - 3}
                                    </div>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}