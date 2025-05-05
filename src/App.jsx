import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";
import NowShowing from "./pages/NowShowing";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Theaters from "./pages/Theaters";
import BookedTickets from "./pages/BookedTickets";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/home" element={<Home />} />
        <Route path="/now-showing" element={<NowShowing />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path="/booked-tickets" element={<BookedTickets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
