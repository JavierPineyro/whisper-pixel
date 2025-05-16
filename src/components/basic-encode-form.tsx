import { Card, CardContent, CardDescription, CardHeader } from "~/components/ui/card"
import { BasicEncodeFormFilepond } from "./forms/basic-encode-form-filepond"

export function BasicEncodeForm() {
  return (
    <Card className="border-transparent shadow-none  bg-transparent rounded-none pt-3">
      <CardHeader>
        <CardDescription>Sube una imagen y escribe el mensaje que deseas ocultar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BasicEncodeFormFilepond />
      </CardContent>
    </Card>
  )
}
