import { Button } from "~/components/ui/button";
import { Lock, ImagePlus, CrownIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

export default function HomePage() {
  return (
    <main className="flex px-4 py-8 min-h-screen items-start gap-6 justify-evenly bg-background text-foreground">
      <section className="flex-1 p-4">
        <Card className="border-purple-800/20 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-1"><Lock className="size-4" />Ocultar Mensaje</CardTitle>
            <CardDescription>Sube una imagen y escribe el mensaje que deseas proteger

              <ImagePlus className="size-8" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje Secreto</Label>
              <Textarea id="message" placeholder="Escribe tu mensaje secreto aquí..." className="min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Ocultar Mensaje</Button>
          </CardFooter>
        </Card>

      </section>
      <section className="items-center md:flex-1 justify-center lg:flex flex-col p-4 gap-4">
        <h1 className="text-lg md:text-4xl">Oculta y revela mensajes secretos en imágenes PNG</h1>
        <Button className="flex items-center justify-center w-full md:w-16 bg-accent text-input font-bold hover:text-foreground hover:bg-accent/80 uppercase gap-2 rounded-full">
          <CrownIcon className="size-5" />
          Registrate
        </Button>
        <p className="text-center text-muted-foreground text-sm md:text-base">
          Protege tus secretos con la tecnología de esteganografía ¡Es gratis y no necesitas tarjeta de crédito!. Con Whisper Pixel, puedes ocultar mensajes en imágenes PNG de forma segura. Ya sea que quieras enviar un mensaje privado o simplemente divertirte, nuestra herramienta te permite hacerlo de manera rápida y secilla. Además, puedes revelar mensajes ocultos en imágenes que hayas recibido. <span className="font-semibold text-accent">¡Prueba Whisper Pixel hoy mismo y registrate para acceder a más funciones y niveles de protección!</span>
        </p>
      </section>
    </main>
  );
}
