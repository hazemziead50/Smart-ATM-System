import { Routes , Route} from "react-router-dom";
import Login from '../Pages/Login'
import Dashboard from "../Pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Deposit from "../Pages/Deposit";
import Withdraw  from "../Pages/Withdraw";
import Transfer from "../Pages/Transfer";
import History  from "../Pages/History";
import Notfound from "../Pages/Notfound";
import Settings from "../Pages/Settings";
import Watchlist from '../Pages/Watchlist'
import Register  from '../Pages/Register '
export default function AppRoutes (){
    return(
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path="*" element={<Notfound />} />
        </Routes>
    )
}