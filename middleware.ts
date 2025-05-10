import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  // No forzamos login ni redireccionamos a ningún workspace
  return NextResponse.next()
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
