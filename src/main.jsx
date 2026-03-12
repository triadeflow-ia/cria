import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import PromptGenerator from './pages/PromptGenerator'
import Validation from './pages/Validation'
import Briefing from './pages/Briefing'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Briefing — standalone, sem Layout (link compartilhavel) */}
        <Route path="/briefing" element={<Briefing />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/prompt-generator" element={<PromptGenerator />} />
          <Route path="/validation" element={<Validation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
