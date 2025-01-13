import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const ServerIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: { serverId: string }
}) => {

    const profile = await currentProfile();

    if (!profile) {
        return RedirectToSignIn
    }

    const server = await db.server.findUnique({
        where: {
            id: params?.serverId,
            members: {
                some: {
                    profileId: profile?.id
                }
            }
        }
    })

    if (!server) {
        return redirect("/")
    }

    return (
        <div className="h-full">
            <div className=" hidden md:flex h-full flex-col fixed w-60 inset-y-0 z-20">
                <ServerSidebar serverId={params?.serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout;