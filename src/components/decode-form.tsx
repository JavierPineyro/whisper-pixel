"use client"

import { useState } from "react"
import { Upload, Search, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"

export function DecodeForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [revealedMessage, setRevealedMessage] = useState("")

  return (
    <Card className="border-purple-800/20 bg-card/50">
      <CardHeader>
        <CardTitle>Revelar Mensaje</CardTitle>
        <CardDescription>Sube una imagen con un mensaje oculto para revelarlo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="decode-image-upload">Imagen con Mensaje Oculto</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="decode-image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 border-border"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-muted-foreground">PNG (Max. 5MB)</p>
                {selectedFile && <p className="mt-2 text-sm text-purple-500">{selectedFile.name}</p>}
              </div>
              <input
                id="decode-image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0])
                  }
                }}
              />
            </label>
          </div>
        </div>

        {revealedMessage && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Mensaje Revelado
            </Label>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm">{revealedMessage}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña (opcional)</Label>
          <Input id="password" type="password" placeholder="Ingresa la contraseña si el mensaje está protegido" />
          <p className="text-xs text-muted-foreground">
            Solo necesario si el mensaje fue ocultado con protección de contraseña
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => setRevealedMessage("Este es un mensaje de prueba que ha sido revelado de la imagen.")}
        >
          <Search className="mr-2 h-4 w-4" />
          Revelar Mensaje
        </Button>
      </CardFooter>
    </Card>
  )
}