import ChatHeader from "@/components/chat/chat-header";
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

    if(!channel || !member){
        return redirect("/")
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                serverId={channel.serverId}
                name={channel?.name}
                type="channel"
            />
        </div>
    )
}

export default ChannelIdPage;