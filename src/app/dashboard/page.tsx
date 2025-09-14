"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Eye, Lock, Menu, Github, Twitter, Linkedin } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DecodeForm } from "@/components/decode-form"
import { EncodeForm } from "@/components/encode-form"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [revealImage, setRevealImage] = useState<string | null>(null)
  const [encryptionType, setEncryptionType] = useState("basic")
  const [secretMessage, setSecretMessage] = useState("")
  const [encryptionLevel, setEncryptionLevel] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "encrypt" | "reveal") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "encrypt") {
          setSelectedImage(result)
        } else {
          setRevealImage(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEncrypt = () => {
    console.log("Encrypting message:", { secretMessage, encryptionType, encryptionLevel })
  }

  const handleReveal = () => {
    console.log("Revealing message from image")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                SecretVault
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-pink-400 hover:bg-purple-900/50">
                ¿Cómo funciona?
              </Button>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-900/50 bg-transparent"
              >
                Iniciar Sesión
              </Button>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                Registrarse
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 border-purple-800">
                <div className="flex flex-col space-y-4 mt-8">
                  <Button variant="ghost" className="text-gray-300 hover:text-pink-400 justify-start">
                    ¿Cómo funciona?
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-900/50 justify-start bg-transparent"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 justify-start">
                    Registrarse
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-white bg-clip-text text-transparent mb-4">
            Oculta tus secretos en imágenes
          </h1>
          <p className="text-gray-100 text-lg max-w-2xl mx-auto">
            Utiliza técnicas avanzadas de esteganografía para ocultar mensajes secretos dentro de imágenes de forma
            invisible.
          </p>
        </div>

        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 border border-purple-800/30">
            <TabsTrigger
              value="encrypt"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Encriptar
            </TabsTrigger>
            <TabsTrigger
              value="reveal"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Revelar
            </TabsTrigger>
          </TabsList>

          {/* Encrypt Tab */}
          <TabsContent value="encrypt" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <Card className="bg-black/30 border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-pink-400">Selecciona una imagen</CardTitle>
                  <CardDescription className="text-gray-100">
                    Sube la imagen donde quieres ocultar tu mensaje secreto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-purple-600/50 rounded-lg p-8 text-center hover:border-pink-500/50 transition-colors">
                      {selectedImage ? (
                        <div className="space-y-4">
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <Image
                              src={selectedImage || "/placeholder.svg"}
                              alt="Selected image"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedImage(null)}
                            className="border-purple-600 text-purple-300 hover:bg-purple-900/50"
                          >
                            Cambiar imagen
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 text-purple-400 mx-auto" />
                          <div>
                            <p className="text-gray-50 mb-2">Arrastra una imagen aquí o</p>
                            <Label htmlFor="encrypt-image" className="cursor-pointer">
                              <Button
                                variant="outline"
                                className="border-purple-600 text-purple-300 hover:bg-purple-900/50 bg-transparent"
                              >
                                Seleccionar archivo
                              </Button>
                            </Label>
                            <Input
                              id="encrypt-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "encrypt")}
                            />
                          </div>
                          <p className="text-sm text-gray-300">PNG, JPG hasta 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Section */}
              <Card className="bg-black/30 border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-pink-400">Configuración del mensaje</CardTitle>
                  <CardDescription className="text-gray-100">
                    Define tu mensaje secreto y las opciones de encriptación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Secret Message */}
                  <div className="space-y-2">
                    <Label htmlFor="secret-message" className="text-gray-50">
                      Mensaje secreto
                    </Label>
                    <Textarea
                      id="secret-message"
                      placeholder="Escribe tu mensaje secreto aquí..."
                      value={secretMessage}
                      onChange={(e) => setSecretMessage(e.target.value)}
                      className="bg-slate-800/50 border-purple-700/50 text-gray-100 placeholder:text-gray-500 focus:border-pink-500"
                      rows={4}
                    />
                  </div>

                  {/* Encryption Type */}
                  <div className="space-y-3">
                    <Label className="text-gray-50">Tipo de protección</Label>
                    <RadioGroup value={encryptionType} onValueChange={setEncryptionType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" className="border-purple-600 text-pink-500" />
                        <Label htmlFor="basic" className="text-gray-50 cursor-pointer">
                          Básico - Solo ocultar el mensaje
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="encrypted" id="encrypted" className="border-purple-600 text-pink-500" />
                        <Label htmlFor="encrypted" className="text-gray-50 cursor-pointer">
                          Encriptado - Protección adicional con contraseña
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Encryption Level */}
                  <div className="space-y-2">
                    <Label htmlFor="encryption-level" className="text-gray-50">
                      Nivel de encriptación
                    </Label>
                    <Select
                      value={encryptionLevel}
                      onValueChange={setEncryptionLevel}
                      disabled={encryptionType === "basic"}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-purple-700/50 text-gray-100 disabled:opacity-50">
                        <SelectValue placeholder="Selecciona el nivel" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-700">
                        <SelectItem value="low" className="text-gray-100 focus:bg-purple-900/50">
                          Protección Baja
                        </SelectItem>
                        <SelectItem value="medium" className="text-gray-100 focus:bg-purple-900/50">
                          Protección Media
                        </SelectItem>
                        <SelectItem value="high" className="text-gray-100 focus:bg-purple-900/50">
                          Protección Alta
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleEncrypt}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3"
                    disabled={!selectedImage || !secretMessage}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Ocultar mensaje en imagen
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reveal Tab */}
          <TabsContent value="reveal" className="mt-8">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-black/30 border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-pink-400">Revelar mensaje oculto</CardTitle>
                  <CardDescription className="text-gray-100">
                    Sube una imagen que contenga un mensaje secreto para revelarlo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-purple-600/50 rounded-lg p-8 text-center hover:border-pink-500/50 transition-colors">
                      {revealImage ? (
                        <div className="space-y-4">
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <Image
                              src={revealImage || "/placeholder.svg"}
                              alt="Image to reveal"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setRevealImage(null)}
                            className="border-purple-600 text-purple-300 hover:bg-purple-900/50"
                          >
                            Cambiar imagen
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Eye className="w-12 h-12 text-purple-400 mx-auto" />
                          <div>
                            <p className="text-gray-50 mb-2">Arrastra una imagen aquí o</p>
                            <Label htmlFor="reveal-image" className="cursor-pointer">
                              <Button
                                variant="outline"
                                className="border-purple-600 text-purple-300 hover:bg-purple-900/50 bg-transparent"
                              >
                                Seleccionar archivo
                              </Button>
                            </Label>
                            <Input
                              id="reveal-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "reveal")}
                            />
                          </div>
                          <p className="text-sm text-gray-300">PNG, JPG hasta 10MB</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleReveal}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3"
                      disabled={!revealImage}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Revelar mensaje secreto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Use Section */}
        <div className="mt-20 mb-12">
          <Card className="bg-gray-900/80 border-purple-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                ¿Cómo funciona?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-pink-300 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Para Encriptar
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">
                        Selecciona una imagen donde quieres ocultar tu mensaje
                      </p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">
                        Escribe tu mensaje secreto en el campo de texto
                      </p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">
                        Elige el tipo de protección (básico o encriptado)
                      </p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">
                        Haz clic en "Ocultar mensaje" y descarga tu imagen
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-cyan-300 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Para Revelar
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">
                        Sube una imagen que contenga un mensaje oculto
                      </p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">Haz clic en "Revelar mensaje secreto"</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">Si está encriptado, ingresa la contraseña</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <p className="text-gray-100 leading-relaxed pt-0.5">¡Descubre el mensaje secreto oculto!</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-purple-900/20 to-black border-t border-purple-800/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-100">Creado por</span>
              <span className="font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Javi
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-pink-400 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-pink-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-pink-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}