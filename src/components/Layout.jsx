import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, FileText, Cpu, CheckCircle } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Metodo', icon: Home },
  { path: '/onboarding', label: 'Onboarding', icon: FileText },
  { path: '/prompt-generator', label: 'Prompt Generator', icon: Cpu },
  { path: '/validation', label: 'Validacao', icon: CheckCircle },
]

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-surface-lighter bg-surface-light/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-white no-underline">
              <span className="text-2xl">🧬</span>
              <span className="font-bold text-lg">Metodo CRIA</span>
              <span className="text-xs text-primary-light bg-primary/20 px-2 py-0.5 rounded-full ml-2">v1.0</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                    pathname === path
                      ? 'bg-primary/20 text-primary-light'
                      : 'text-slate-400 hover:text-white hover:bg-surface-lighter/50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-surface-lighter py-6 text-center text-sm text-slate-500">
        Metodo CRIA — Triadeflow &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
