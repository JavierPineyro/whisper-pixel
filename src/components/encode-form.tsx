"use client"

import { useState } from "react"
import { Upload, Lock, AlertCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

export function EncodeForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [encryptionType, setEncryptionType] = useState("basic")

  return (
    <Card className="border-purple-800/20 bg-card/50">
      <CardHeader>
        <CardTitle>Ocultar Mensaje</CardTitle>
        <CardDescription>Sube una imagen y escribe el mensaje que deseas ocultar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Imagen</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 border-border"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
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

        <div className="space-y-2">
          <Label>Método de Ocultamiento</Label>
          <RadioGroup defaultValue="basic" onValueChange={setEncryptionType} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic" className="cursor-pointer">
                Básico
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="encrypted" id="encrypted" />
              <Label htmlFor="encrypted" className="cursor-pointer">
                Encriptado
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="password-protection" disabled />
              <Label htmlFor="password-protection" className="text-muted-foreground">
                Protección con Contraseña
              </Label>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Esta función estará disponible próximamente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {encryptionType === "encrypted" && (
            <div className="space-y-2">
              <Label htmlFor="encryption-level">Nivel de Encriptación</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="encryption-level">
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bajo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Alert variant="default" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
          <Lock className="h-4 w-4" />
          <AlertTitle className="font-semibold">Seguridad</AlertTitle>
          <AlertDescription className="text-purple-500/80">
            Tu mensaje será ocultado de forma segura en la imagen. Solo quien conozca que existe un mensaje oculto podrá
            extraerlo.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Ocultar Mensaje</Button>
      </CardFooter>
    </Card>
  )
}
