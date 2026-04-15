import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { type NextRequest, NextResponse } from 'next/server';
import { amplifyConfig } from '#src/features/auth';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/') {
    const isAuthenticatedResult = await isAuthenticated(request);
    if (!isAuthenticatedResult) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
};

const isAuthenticated = async (request: NextRequest): Promise<boolean> => {
  const response = NextResponse.next();
  const session = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  });
  return !!session.tokens;
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
