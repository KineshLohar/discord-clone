import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { ServerHeader } from "./server-header"
import { HashIcon, Mic, Search, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { ServerSearch } from "./server-search"
import { ServerSection } from "./server-section"
import { Separator } from "../ui/separator"
import { ServerChannel } from "./server-channel"
import { ServerMember } from "./server-member"

const iconMap = {
    [ChannelType.TEXT]: <HashIcon className=" mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className=" mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className=" mr-2 h-4 w-4" />,
}

const roleMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 w-4 h-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}


export const ServerSidebar = async ({ serverId }: { serverId: string }) => {

    const profile = await currentProfile()

    if (!profile) {
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    if (!server) {
        return redirect('/')
    }

    const textChannels = server?.channels?.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels?.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels?.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members?.filter((member) => member.profileId !== profile.id)

    const role = server.members.find((member) => member.profileId === profile?.id)?.role

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]  ">
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="px-3 flex-1">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member?.id,
                                    name: member?.profile?.name,
                                    icon: roleMap[member?.role]
                                }))
                            }
                        ]}
                    />
                </div>
                <Separator className="text-zinc-200 dark:text-zinc-700 rounded-md my-2" />
                {
                    !!textChannels.length && (
                        <div className="mb-2">
                            <ServerSection
                                role={role}
                                label="Text Channels"
                                sectionType="channels"
                                channelType={ChannelType.TEXT}
                            />
                            {
                                textChannels?.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                {
                    !!audioChannels.length && (
                        <div className="mb-2">
                            <ServerSection
                                role={role}
                                label="Voice Channels"
                                sectionType="channels"
                                channelType={ChannelType.AUDIO}
                            />
                            {
                                audioChannels?.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                {
                    !!videoChannels.length && (
                        <div className="mb-2">
                            <ServerSection
                                role={role}
                                label="Video Channels"
                                sectionType="channels"
                                channelType={ChannelType.VIDEO}
                            />
                            {
                                videoChannels?.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                {
                    !!members.length && (
                        <div className="mb-2">
                            <ServerSection
                                role={role}
                                label="Members"
                                sectionType="members"
                                server={server}
                            />
                            {
                                members?.map((member) => (
                                    <ServerMember
                                        key={member.id}
                                        member={member}
                                        server={server}
                                    />
                                )
                                )
                            }
                        </div>
                    )
                }
            </ScrollArea>

        </div>
    )
}

