import { db } from "@/config/db";
import { openrouter } from "@/config/openRouter";
import { ScreenConfigTable } from "@/config/schema";
import { Generate_UI } from "@/data/Prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const { projectId,screenId,ScreenName,purpose,screenDescription } = await req.json();

    const userInput=`
        screenName is : ${ScreenName},
        screen Purpose : ${purpose},
        screen Description : ${screenDescription}
    `

    try {
        const result = await openrouter.chat.send({
                model: "xiaomi/mimo-v2-flash:free",
                messages: [
                    {
                    role: "system",
                    content: [
                        {
                        type: "text",
                        text: Generate_UI
                        }
                    ]
                    },{
                        role:"user",
                        "content" : [
                            {
                                type:"text",
                                text:userInput
                            }
                        ]
                    }
                ],
                stream: false,
            })
    
            const code = result.choices[0].message.content;
            console.log(code);
    
            const updateResult = await db.update(ScreenConfigTable)
            .set({
                code : code as string
            }).where(and(eq(ScreenConfigTable.projectId,projectId),eq(ScreenConfigTable.screenId,screenId)))
            .returning()
    
            return NextResponse.json(updateResult[0]);
    } catch (error) {
        return NextResponse.json("Server Side error "+error)
    }

}