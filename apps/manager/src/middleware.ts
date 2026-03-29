import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { type NextRequest, NextResponse } from 'next/server';
import { amplifyConfig } from '#src/features/auth/config';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const response = NextResponse.next();
  const session = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  });
  return session.tokens !== undefined;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const authed = await isAuthenticated(request);

  if (pathname === '/login') {
    if (authed) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
