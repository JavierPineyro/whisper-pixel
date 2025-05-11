import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EncodeForm } from "@/components/encode-form"
import { DecodeForm } from "@/components/decode-form"
import { Navbar } from "@/components/navbar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Whisper Pixel</h1>
          <p className="text-muted-foreground mt-2">Oculta mensajes en imágenes o revela mensajes ocultos</p>
        </div>

        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="encode">Ocultar Mensaje</TabsTrigger>
            <TabsTrigger value="decode">Revelar Mensaje</TabsTrigger>
          </TabsList>
          <TabsContent value="encode">
            <EncodeForm />
          </TabsContent>
          <TabsContent value="decode">
            <DecodeForm />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container flex flex-col items-center justify-center gap-2 text-center text-sm">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Whisper Pixel. Ningún derecho reservado.
          </p>
        </div>
      </footer>
    </div>
  )
}