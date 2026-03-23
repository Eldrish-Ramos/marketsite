import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';

function App() {
  return (
    <div style={{background: '#0A0A0A', minHeight: '100vh'}}>
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
