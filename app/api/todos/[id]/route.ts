import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// PATCH /api/todos/:id — update a todo. Body can include { text?, done? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (!body || (body.done === undefined && body.text === undefined)) {
    return NextResponse.json(
      { error: "nothing to update" },
      { status: 400 }
    );
  }

  const update: { done?: boolean; text?: string } = {};
  if (typeof body.done === "boolean") update.done = body.done;
  if (typeof body.text === "string" && body.text.trim()) {
    update.text = body.text.trim();
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("todos")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE /api/todos/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("todos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
