import { db } from "@/config/db";
import { openrouter } from "@/config/openRouter";
import { ScreenConfigTable } from "@/config/schema";
import { Screen_Regenerate } from "@/data/Prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {projectId,screenId,oldCode,userInput,theme} = await req.json();

    const USER_INPUT = `
    userINPUT : {
        userInput : ${userInput}
        oldCode : ${oldCode}
        theme : ${theme}
    } 

    Regenerate the screen following all rules.
    ${Screen_Regenerate}
    `

    try {
            const result = await openrouter.chat.send({
                    model: "xiaomi/mimo-v2-flash:free",
                    messages: [
                        {
                            role:"user",
                            "content" : [
                                {
                                    type:"text",
                                    text:USER_INPUT
                                }
                            ]
                        }
                    ],
                    stream: false,
                })
        
                const code = result.choices[0].message.content;
        
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