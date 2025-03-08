import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string,
        channelId: string
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return RedirectToSignIn;
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params?.channelId,
            serverId: params?.serverId
        }
    })

    const member = await db.member.findFirst({
        where: {
            profileId: profile?.id,
            serverId: params?.serverId
        }
    })

    if (!channel || !member) {
        return redirect("/")
    }

    return (
        <div className="h-full bg-white dark:bg-[#313338] flex flex-col ">
            <ChatHeader
                serverId={channel.serverId}
                name={channel?.name}
                type="channel"
            />
            <ChatMessages
                name={channel?.name}
                member={member}
                chatId={channel?.id}
                type="channel"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                    channelId: channel?.id,
                    serverId: channel?.serverId
                }}
                paramKey="channelId"
                paramValue={channel?.id}
            />
            <ChatInput
                name={channel?.name}
                type="channel"
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel?.id,
                    serverId: channel?.serverId
                }}
            />
        </div>
    )
}

export default ChannelIdPage;