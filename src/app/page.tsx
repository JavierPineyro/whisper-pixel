import { Button } from "~/components/ui/button";
import { CrownIcon } from "lucide-react"
import { Card,} from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { BasicDecodeForm } from "~/components/basic-decode-form";
import { BasicEncodeForm } from "~/components/basic-encode-form";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground flex h-full items-start justify-evenly gap-6 px-4 py-8">
      <section className="flex-1 px-4 py-0">
        <Card className="bg-card/50 border-purple-800/20 pb-0">
          <Tabs defaultValue="encode" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="encode">Ocultar Mensaje</TabsTrigger>
              <TabsTrigger value="decode">Revelar Mensaje</TabsTrigger>
            </TabsList>
            <TabsContent value="encode">
              <BasicEncodeForm />
            </TabsContent>
            <TabsContent value="decode">
              <BasicDecodeForm />
            </TabsContent>
          </Tabs>
        </Card>
      </section>
      <section className="flex-col items-center justify-center gap-4 p-4 md:flex-1 lg:flex">
        <h1 className="text-lg md:text-4xl">
          Oculta y revela mensajes secretos en imágenes PNG
        </h1>
        <Button className="bg-accent text-input hover:text-foreground hover:bg-accent/80 flex w-full items-center justify-center gap-2 rounded-full font-bold uppercase md:w-40">
          <CrownIcon className="size-5" />
          Registrate
        </Button>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Protege tus secretos con Whisper Pixel ¡Es gratis!. Oculta y revela
          mensajes secretos en imágenes PNG de forma segura. Ya sea que quieras
          enviar un mensaje privado o simplemente divertirte, nuestra
          herramienta te permite hacerlo de manera rápida y secilla.<br/>
	        <span className="text-accent/80 font-semibold">
            ¡Registrate para acceder funciones avanzadas!
          </span>
        </p>
      </section>
    </main>
  );
}
