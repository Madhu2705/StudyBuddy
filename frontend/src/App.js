import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Timer from "./pages/Timer";
import Ratings from "./pages/Ratings";
import Tasks from "./pages/Tasks";
import CreateNotes from "./pages/CreateNotes";
import Faqs from "./pages/faqs";

export default function App(){
 return(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/timer" element={<Timer/>}/>
   <Route path="/faqs" element={<Faqs/>}/>
    <Route path="/ratings" element={<Ratings/>}/>
    <Route path="/tasks" element={<Tasks/>}/>
    <Route path="/notes" element={<CreateNotes/>}/>
   </Routes>
  </BrowserRouter>
 );
}