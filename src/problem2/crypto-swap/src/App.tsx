import CryptoSwapForm from './components/CryptoSwapForm'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 relative overflow-hidden">
      <div className="text-center mb-8 z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
          Crypto Swap
        </h1>
      </div>

      <CryptoSwapForm />
    </div>
  )
}

export default App
