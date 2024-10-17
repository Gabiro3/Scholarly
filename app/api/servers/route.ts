import { currentProf } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"
import {v4 as uuidv4} from "uuid"
import { toast } from "react-hot-toast"


export async function POST(req:Request) {
    try {
        const {name, imageUrl} = await req.json();
        const profile = await currentProf();

        if (!profile ){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels:{
                    create:[
                        {name: "general", profileId: profile.id},
                    ]
                },
                members:{
                    create:[
                        {profileId: profile.id, role: MemberRole.ADMIN},
                    ]}
            }
        })
        toast.success("Server created successfully!")  
        return NextResponse.json(server)
    } catch (error) {
        toast.error("Something went wrong, Contact side admin!")
        return new NextResponse("Internal Error", {status: 500})
        
    }
}
