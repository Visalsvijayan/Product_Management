 
 import Signup from "./pages/Signup"
 import {Routes,Route, Navigate} from 'react-router-dom'
 import VerifyOtp from "./pages/VerifyOtp"
 import Login from "./pages/Login"
 import ProtectedRoute from "./components/ProtectedRoute"
 import ProductCard from "./components/ProductCard"
 import ProductList from "./pages/ProductList"
 import Navbar from "./components/Navbar"
 import CreateProduct from "./pages/CreateProduct"
function App() {
 
  return (
   <>
   <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path='/signup' element={<Signup/>}/>
    <Route path="/verify-otp" element={<VerifyOtp/>}/>
    <Route path="/login" element={<Login/>}/>


     {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>

          <Route path="/products" element={
                            <>
                                <Navbar />
                                <ProductList />
                            </>
                        }
          />

          <Route path="/create-product" element={
                            <>
                                <Navbar />
                                <CreateProduct />
                            </>
                        }
          />

      </Route>

      {/* Not Found */}

      <Route path="*" element={<Navigate to="/products" replace />} />

   </Routes>
   

   </>
  )
}

export default App
