import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import PromptGenerator from './pages/PromptGenerator'
import Validation from './pages/Validation'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
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
