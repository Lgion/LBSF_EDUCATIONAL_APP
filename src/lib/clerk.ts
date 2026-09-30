// Configuration Clerk Auth pour le client React et les vérifications de rôles
import type { UserRole } from '../types/bsf';

export const CLERK_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_CLERK_PUBLISHABLE_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
  'pk_test_ZGl2ZXJzZS1nb2F0LTU0LmNsZXJrLmFjY291bnRzLmRldiQ';

export const ADMIN_EMAILS = [
  'hi.cyril@gmail.com',
  'puissancedamour@yahoo.fr',
  'legion.athenienne@gmail.com'
];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function getUserRoles(email?: string | null, metadataRoles?: UserRole[]): UserRole[] {
  const roles: UserRole[] = metadataRoles ? [...metadataRoles] : ['VISITOR'];
  if (isSuperAdminEmail(email) && !roles.includes('SUPER_ADMIN')) {
    roles.push('SUPER_ADMIN');
  }
  return roles;
}
