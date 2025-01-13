'use client'

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "../../../types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole
}
export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal()
    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || MemberRole.MODERATOR

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
                <button className="w-full text-md font-semibold flex items-center justify-between px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-500/50 transition">
                    {server.name}
                    <ChevronDown />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] ">
                {
                    isModerator && (
                        <DropdownMenuItem
                            onClick={() => onOpen('invite', { server })}
                            className=" text-indigo-600 dark:text-indigo-400 text-sm cursor-pointer px-3 py-2">
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="text-sm cursor-pointer px-3 py-2">
                            Server Settings
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="text-sm cursor-pointer px-3 py-2">
                            Manage Members
                            <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (
                        <DropdownMenuItem className="text-sm cursor-pointer px-3 py-2">
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (
                        <DropdownMenuSeparator />
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="text-rose-500 text-sm cursor-pointer px-3 py-2">
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>

                    )
                }
                {
                    !isAdmin && (
                        <DropdownMenuItem className="text-sm cursor-pointer px-3 py-2">
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}