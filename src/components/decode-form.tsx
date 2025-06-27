"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { DecodeFormFilepond } from "./forms/decode-form-filepond"

export function DecodeForm() {
  return (
    <Card className="border-purple-800/20 bg-card/50">
      <CardHeader>
        <CardTitle>Revelar Mensaje</CardTitle>
        <CardDescription>Sube una imagen con un mensaje oculto para revelarlo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DecodeFormFilepond />
      </CardContent>
    </Card>
  )
}