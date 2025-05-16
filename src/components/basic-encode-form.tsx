"use client"

import { useState } from "react"
import { Upload, Lock,  } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

export function BasicEncodeForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  return (
    <Card className="border-transparent shadow-none  bg-transparent rounded-none pt-3">
      <CardHeader>
        <CardDescription>Sube una imagen y escribe el mensaje que deseas ocultar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Imagen</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 border-border"
            >
              <div className="flex flex-col items-center justify-center pt-1 pb-2">
                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG o GIF (Max. 5MB)</p>
                {selectedFile && <p className="mt-2 text-sm text-purple-500">{selectedFile.name}</p>}
              </div>
              <input
                id="image-upload"
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

        <div className="space-y-2">
          <Label htmlFor="message">Mensaje Secreto</Label>
          <Textarea id="message" placeholder="Escribe tu mensaje secreto aquí..." className="min-h-[100px]" />
        </div>

        
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Ocultar Mensaje</Button>
      </CardFooter>
    </Card>
  )
}
