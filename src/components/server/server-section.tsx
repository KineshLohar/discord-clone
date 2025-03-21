'use client'

import { ChannelType, MemberRole } from "@prisma/client"
import { ServerWithMembersWithProfiles } from "../../../types"
import { ActionTooltip } from "../action-tooltip"
import { Plus, Settings } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"


interface ServerSectionProps {
    label: string,
    role?: MemberRole,
    channelType?: ChannelType,
    sectionType: 'channels' | 'members',
    server?: ServerWithMembersWithProfiles
}

export const ServerSection = ({
    role,
    channelType,
    label,
    sectionType,
    server
}: ServerSectionProps) => {
    const { onOpen } = useModal();


    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-sm uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {
                role !== MemberRole.GUEST && sectionType === 'channels' && (
                    <ActionTooltip label='create channel' side="top" align="center">
                        <button
                            onClick={() => onOpen("createChannel", { channelType })}
                            className=" text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </ActionTooltip>
                )
            }
            {
                role === MemberRole.ADMIN && sectionType === 'members' && (
                    <ActionTooltip label='Manage members' side="top" align="center">
                        <button
                            onClick={() => onOpen("members", { server })}
                            className=" text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </ActionTooltip>
                )
            }
        </div>
    )
}