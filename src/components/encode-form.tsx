import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { EncodeFormFilepond } from "./forms/encode-form-filepond"

export function EncodeForm() {
  return (
    <Card className="border-purple-800/20 bg-card/50">
      <CardHeader>
        <CardTitle>Ocultar Mensaje</CardTitle>
        <CardDescription>Sube una imagen y escribe el mensaje que deseas ocultar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EncodeFormFilepond />
      </CardContent>
    </Card>
  )
}
