import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ThemeProvider from './components/ThemeProvider';
import ScrollToTop from './components/ScrollToTop';
function App() {

  return (
    <>
      <ThemeProvider>
      <ScrollToTop/>
      <Header/>
      <Outlet/>
      <Footer/>
      </ThemeProvider>
    </>
  )
}

export default App
