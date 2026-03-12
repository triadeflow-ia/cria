import { Outlet, NavLink, Link } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Metodo' },
  { path: '/onboarding', label: 'Onboarding' },
  { path: '/prompt-generator', label: 'Prompt Generator' },
  { path: '/validation', label: 'Validacao' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#001323]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">CRIA</span>
            <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Metodo</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-8 bg-[#001323]">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">C</span>
            </div>
            <span className="text-sm font-semibold">CRIA</span>
            <span className="text-xs text-white/40 ml-1">by Triadeflow</span>
          </div>
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} Triadeflow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
