import { db } from "@/config/db";
import { openrouter } from "@/config/openRouter";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const {userInput,deviceType,projectId} = await req.json();
    const result = await openrouter.chat.send({
        model: "xiaomi/mimo-v2-flash:free",
        messages: [
            {
            role: "system",
            content: [
                {
                type: "text",
                text: APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}",deviceType)
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

    const JSONAiResult= JSON.parse(result.choices[0].message.content as string);

    if(JSONAiResult){
    //update project table with project name
    await db.update(ProjectTable).set({
        projectVisualDescription:JSONAiResult.globalProjectVisualDescription,
        projectName:JSONAiResult.projectName,
        theme:JSONAiResult.theme
    }).where(eq(ProjectTable.projectId,projectId as string))

    // insert screen configuration
    JSONAiResult.screens?.forEach(async (screen:any)=>{
        const result = await db.insert(ScreenConfigTable).values({
            projectId:projectId,
            purpose:screen?.purpose,
            screenDescription:screen.layoutDescription,
            screenId:screen.id,
            screenName:screen?.name
        })
    })

    // console.log(result);
    return NextResponse.json(JSONAiResult);

    }else{
        return NextResponse.json("internal server error")
    }

}

