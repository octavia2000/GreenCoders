import { Header } from './components/layout/Header'
import { Hero } from './components/common/Hero'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-eco-50 border border-eco-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-eco-800 mb-2">
                GreenCoders Sustainability Marketplace
              </h2>
              <p className="text-eco-700">
                GreenCoders Sustainability Marketplace is currently being built. 
                This is the frontend starter kit with React, Vite, TailwindCSS, and shadcn/ui.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
