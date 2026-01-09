import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userInput, device, projectId } = await req.json();
  const user = await currentUser();

  const result = await db
    .insert(ProjectTable)
    .values({
      projectId: projectId,
      userId: user?.primaryEmailAddress?.emailAddress as string,
      device: device,
      userInput: userInput,
    })
    .returning();

  return NextResponse.json(result[0]);
}

export async function GET(req: NextRequest) {
  const projectId = await req.nextUrl.searchParams.get("projectId");

  const user = await currentUser();

  try {
    if (!projectId) {
      const result = await db
        .select()
        .from(ProjectTable)
        .where(
            eq(
              ProjectTable.userId,
              user?.primaryEmailAddress?.emailAddress as string
            )
          )
          .orderBy(desc(ProjectTable.id))

      return NextResponse.json(result)
    }

    const result = await db
      .select()
      .from(ProjectTable)
      .where(
        and(
          eq(ProjectTable.projectId, projectId as string),
          eq(
            ProjectTable.userId,
            user?.primaryEmailAddress?.emailAddress as string
          )
        )
      );

    const ScreenConfig = await db
      .select()
      .from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId as string));

    return NextResponse.json({
      projectDetail: result[0],
      screenConfig: ScreenConfig,
    });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function PUT(req: NextRequest) {
  const { projectName, theme, projectId, screenShot } = await req.json();

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  const updateFields: any = {};

  if (projectName !== undefined) updateFields.projectName = projectName;
  if (theme !== undefined) updateFields.theme = theme;
  if (screenShot !== undefined)
    updateFields.screenShot = (screenShot as string) ?? null;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "No values provided to update" },
      { status: 400 }
    );
  }

  const result = await db
    .update(ProjectTable)
    .set(updateFields)
    .where(eq(ProjectTable.projectId, projectId))
    .returning();

  return NextResponse.json(result[0]);
}
