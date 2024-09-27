import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ThemeProvider from './components/ThemeProvider';
function App() {

  return (
    <>
      <ThemeProvider>
      <Header/>
      <Outlet/>
      <Footer/>
      </ThemeProvider>
    </>
  )
}

export default App
