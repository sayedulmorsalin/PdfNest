import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div 
      className="flex flex-col min-h-screen bg-background text-foreground"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'rgb(26, 26, 46)',
        color: 'rgb(240, 240, 240)',
      }}
    >
      <Navbar />
      <main 
        className="flex-grow max-w-7xl mx-auto w-full px-4 py-8"
        style={{
          flex: 1,
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
