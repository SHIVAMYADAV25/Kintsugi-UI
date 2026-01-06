import { db } from "@/config/db";
import { ProjectTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to create a new project entry and returns the inserted row.
 *
 * Expects the request JSON body to contain `userInput`, `device`, and `projectId`. Uses the currently
 * authenticated user's primary email address as `userId` and inserts a new record into `ProjectTable`.
 *
 * @param req - Incoming NextRequest whose JSON body includes `userInput`, `device`, and `projectId`
 * @returns The newly inserted project row from `ProjectTable`
 */
export async function POST(req:NextRequest) {
    const {userInput,device,projectId} = await req.json();
    const user = await currentUser();

    const result = await db.insert(ProjectTable).values({
        projectId : projectId,
        userId : user?.primaryEmailAddress?.emailAddress as string,
        device:device,
        userInput : userInput
    }).returning();

    return NextResponse.json(result[0]);
}