import React from 'react';

interface SidebarProps {
  currentPath?: string;
}

export default function AdminSidebar({ currentPath = '/admin' }: SidebarProps) {
  const links = [
    { label: 'Vue d\'ensemble', href: '/admin', icon: 'dashboard' },
    { label: 'Paramètres & Devises', href: '/admin/settings', icon: 'tune' },
    { label: 'Formations & Avis', href: '/admin/formations', icon: 'school' },
    { label: 'Boutique & Stocks', href: '/admin/shop', icon: 'storefront' },
    { label: 'Diagnostic SOP', href: '/admin/diagnostic', icon: 'healing' },
    { label: 'Questions Fréquentes', href: '/admin/faq', icon: 'quiz' },
    { label: 'Commandes Shop', href: '/admin/orders', icon: 'receipt_long' },
    { label: 'Utilisateurs & Rôles', href: '/admin/users', icon: 'manage_accounts' },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-r border-slate-800 flex-shrink-0 flex flex-col min-h-screen">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <span className="material-icons text-white text-xl">admin_panel_settings</span>
          </div>
          <div>
            <div className="font-heading font-bold text-base tracking-wide text-white flex items-center gap-1.5">
              ReWaste <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">Admin</span>
            </div>
            <div className="text-[11px] text-slate-400">Backoffice de Direction</div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Pilotage & Configurations
        </div>

        {links.map((link) => {
          const isActive = currentPath === link.href || (link.href !== '/admin' && currentPath.startsWith(link.href));
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span className={`material-icons text-xl ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Return to website */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <a
          href="/"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-900/50 transition-colors"
        >
          <span className="material-icons text-sm">arrow_back</span>
          <span>Retour au site public</span>
        </a>
      </div>
    </aside>
  );
}
