
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function HomePage() {
  return <h1>Home</h1>;
}

function LoginPage() {
  return <h1>Login</h1>;
}

function NotFoundPage() {
  return <h1>Page not found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
