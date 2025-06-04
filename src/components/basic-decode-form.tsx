import { Card, CardContent, CardDescription, CardHeader } from "~/components/ui/card"
import { BasicDecodeFormFilepond } from "./forms/basic-decode-form-filepond"

export function BasicDecodeForm() {
  return (
    <Card className="border-transparent bg-transparent shadow-none pt-3">
      <CardHeader>
        <CardDescription>Sube una imagen con un mensaje oculto para revelarlo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BasicDecodeFormFilepond />
      </CardContent>
    </Card>
  )
}
