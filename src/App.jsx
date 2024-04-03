import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import PrivuteRoute from './components/PrivuteRoute';
import Profile from './pages/Profile'
import SingIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Offers from './pages/Offers'
import ForgotPass from './pages/ForgotPass'
import Header from './components/Header'
import CreateListing from './pages/CreateListing'
function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/profile' element={<PrivuteRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SingIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/offers" element={<Offers />} />
          <Route path='/create-listing' element={<PrivuteRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPass />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </>
  )
}

export default App
