'use client';

import { AuthGuard } from './AuthGuard';

interface WithAuthOptions {
  requireAuth?: boolean
  redirectTo?: string
  allowedRoles?: string[]
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function WithAuthComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}