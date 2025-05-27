import { PdfForm } from "@/components/pdf-form"

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Enter Details</h1>
        <PdfForm />
      </div>
    </div>
  )
}