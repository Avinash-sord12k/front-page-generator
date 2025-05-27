import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Generate Lab Manual Front Pages With Ease
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            No more hassle in generating lab manual front pages.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="gap-2 group transition-all duration-300">
                Generate Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Lab Manual Front Page Generator. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}