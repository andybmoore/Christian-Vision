import React from 'react'
import ReactDOM from 'react-dom/client'
import PresentationApp from './PresentationApp'
import './presentation.css'
import './cvglobal-deck.css'
import './journey-details.css'
import './appearance.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PresentationApp theme="cv-global" />
  </React.StrictMode>,
)