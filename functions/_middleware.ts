/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only handle root path — all other routes pass through
  if (url.pathname !== "/" && url.pathname !== "") {
    return next();
  }

  // Check cookie preference first (set on previous visit)
  const cookie = request.headers.get("Cookie") ?? "";
  const cookieMatch = cookie.match(/preferred-language=(es|en)/);
  if (cookieMatch) {
    return Response.redirect(new URL(`/${cookieMatch[1]}/`, url), 302);
  }

  // Fall back to Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language") ?? "";
  const preferSpanish = /^es\b/i.test(acceptLanguage);
  const lang = preferSpanish ? "es" : "en";

  const redirectResponse = Response.redirect(new URL(`/${lang}/`, url), 302);

  // Set cookie so subsequent visits skip the header check
  const headers = new Headers(redirectResponse.headers);
  headers.set("Set-Cookie", `preferred-language=${lang}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`);

  return new Response(null, {
    status: 302,
    headers,
  });
};
