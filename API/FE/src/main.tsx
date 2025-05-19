import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeadingWithLink} from './pages/landing'
import Heading1 from './pages/landing'
import { Homeheader } from './components/common/header'
// import Title from './components/common/title'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <Homeheader/>
        <Heading1>SajhaBiz</Heading1>
        <HeadingWithLink title="SajhaBiz" link="/auth/login" btntxt="Login"/>

  </StrictMode>
)
