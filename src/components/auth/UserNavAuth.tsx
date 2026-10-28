import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { CLERK_PUBLISHABLE_KEY, isSuperAdminEmail } from '../../lib/clerk';

function UserStatus() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  const email = user?.primaryEmailAddress?.emailAddress;
  const isSuperAdmin = isSuperAdminEmail(email);

  return (
    <div className="flex items-center gap-3">
      {isSuperAdmin && (
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg border border-amber-500/40 transition-colors shadow-sm"
          title="Accéder au tableau de bord d'administration"
        >
          <span className="material-icons text-xs">admin_panel_settings</span>
          <span className="hidden sm:inline">Admin</span>
        </a>
      )}
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: "h-9 w-9 ring-2 ring-emerald-500/20"
          }
        }}
      />
    </div>
  );
}

export default function UserNavAuth() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <div className="flex items-center">
        <SignedIn>
          <UserStatus />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm">
              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Connexion</span>
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </ClerkProvider>
  );
}
