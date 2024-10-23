import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/apply',
    '/applications/:path*',
    '/documents/:path*',
    '/api/loan-applications/:path*',
    '/api/documents/:path*'
  ]
};