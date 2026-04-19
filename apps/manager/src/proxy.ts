import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { type NextRequest, NextResponse } from 'next/server';
import { amplifyConfig } from '#src/features/auth';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const response = NextResponse.next();

  const isAuthenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      const session = await fetchAuthSession(contextSpec);
      return !!session.tokens;
    },
  });

  const { pathname } = request.nextUrl;
  const isPrivatePage =
    pathname === '/' ||
    pathname.startsWith('/projects/') ||
    pathname.startsWith('/users/');

  if (isPrivatePage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return response;
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
