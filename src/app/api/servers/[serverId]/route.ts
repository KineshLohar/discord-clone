import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params?.serverId) {
            return new NextResponse("Invalid server ID", { status: 400 })
        }

        const server = await db.server.delete({
            where: {
                id: params?.serverId,
                profileId: profile?.id
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("DELETE SERVER ERROR", error);
        return new NextResponse('Internal Server Error', { status: 500 })

    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {

    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params?.serverId) {
            return new NextResponse("Invalid server ID", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: params?.serverId,
                profileId: profile?.id
            },
            data: {
                name,
                imageUrl
            }
        })

        if (!server) {
            return new NextResponse("Server not found", { status: 400 })
        }

        return NextResponse.json(server)
    } catch (error) {
        console.log("EDIT SERVER ERROR", error);
        return new NextResponse('Internal Server Error', { status: 500 })

    }

}