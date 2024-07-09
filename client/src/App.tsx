import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Helmet from "react-helmet"
import LoginForm from './components/loginForm';
import SignUpForm from './components/signUpForm';
import Dashboard from './components/dashboard/expenseDashboard';

function App() {
  return (
    <div>
      <Helmet>
        <title> Calculadora de Gastos Mensais </title>
      </Helmet>
      <Router>
          <Routes>
            <Route path='/' element={<LoginForm />}></Route>
            <Route path='signUp' element={<SignUpForm />}></Route>
            <Route path='dashboard' element={<Dashboard />}></Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
