import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Blog from './pages/Blog'
import Signin from './pages/Signin'
import Blogs from './pages/Blogs'
import Publish from './pages/Publish'
import Homepage from './pages/Homepage'

function App() {
  const data = localStorage.getItem("token");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={(!data) ? <Homepage/> : <Blogs/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/blog/:id' element={<Blog/>}/>
          <Route path='/blogs' element={<Blogs/>}/>
          <Route path="/publish" element={<Publish />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
