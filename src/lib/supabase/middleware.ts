import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith("/painel") || pathname.startsWith("/admin");

  if (!isProtected) {
    return supabaseResponse;
  }

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (pathname.startsWith("/admin") && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  if (pathname.startsWith("/painel") && profile?.role !== "admin" && profile?.status !== "approved") {
    const redirectUrl = new URL("/conta-pendente", request.url);
    redirectUrl.searchParams.set("status", profile?.status ?? "pending");
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
