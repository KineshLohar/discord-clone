import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";




export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server =await db.server.create({
            data: {
                name,
                imageUrl,
                inviteCode: uuidv4(),
                profileId: profile.id,
                channels: {
                    create: [
                        {
                            name: "general",
                            profileId: profile.id,
                            type: ChannelType.TEXT
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[SERVER POST]", error);

        return new NextResponse("Internal server", { status: 500 })

    }
}
