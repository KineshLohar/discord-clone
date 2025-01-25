'use client'

import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-auto text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert  className="w-4 h-4 ml-auto text-rose-500" />
}

export const ServerMember = ({
    member,
    server
}: ServerMemberProps) => {

    const router = useRouter();
    const params = useParams()

    const icon = roleIconMap[member.role]
    return (
        <div>
            {icon}
        </div>
    )
}