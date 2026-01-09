import { db } from "@/config/db";
import { openrouter } from "@/config/openRouter";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT, GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROJECT } from "@/data/Prompt";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const {userInput,deviceType,projectId,oldScreenDescription,theme} = await req.json();
    const result = await openrouter.chat.send({
        model: "xiaomi/mimo-v2-flash:free",
        messages: [
            {
            role: "system",
            content: [
                {
                type: "text",
                text: oldScreenDescription ? 
                GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROJECT.replaceAll("{deviceType}",deviceType).replaceAll("{theme}",theme)
                : APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}",deviceType)
                }
            ]
            },{
                role:"user",
                "content" : [
                    {
                        type:"text",
                        text: oldScreenDescription ? userInput + " Old screen Description is: "+oldScreenDescription :  userInput 
                    }
                ]
            }
        ],
        responseFormat: { type: "json_object" },
        stream: false,
    })

    const JSONAiResult= JSON.parse(result.choices[0].message.content as string);

    if(JSONAiResult){
    //update project table with project name
    !oldScreenDescription && await db.update(ProjectTable).set({
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

export async function DELETE(req:NextRequest) {
    const projectId = req.nextUrl.searchParams.get("projectId");
    const screenId = req.nextUrl.searchParams.get("screenId");

    const user = await currentUser();

    if(!user){
        return NextResponse.json({msg:"Unauthorized user"})
    }

    const result = await db.delete(ScreenConfigTable)
    .where(and(eq(ScreenConfigTable.screenId,screenId as string),eq(ScreenConfigTable.projectId,projectId as string)))

    return NextResponse.json({msg:"Deleted"})
}
