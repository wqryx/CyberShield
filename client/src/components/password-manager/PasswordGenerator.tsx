import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePassword } from "@/lib/encryption";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PasswordGenerator() {
  const { toast } = useToast();
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  const handleGeneratePassword = () => {
    try {
      const password = generatePassword(passwordLength, {
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      });
      setGeneratedPassword(password);
    } catch (error) {
      toast({
        title: "Error al generar contraseña",
        description: "Por favor, inténtalo de nuevo",
        variant: "destructive",
      });
    }
  };

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast({
        title: "Contraseña copiada",
        description: "La contraseña se ha copiado al portapapeles",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Generador de contraseñas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                id="generated-password"
                className="w-full px-4 py-2 border rounded-md pr-10"
                value={generatedPassword || "P$7xK!2mL#9fZ@3"}
                readOnly
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2 h-5 w-5 text-gray-400 hover:text-gray-600"
                onClick={handleCopyPassword}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleGeneratePassword}>Generar</Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
              />
              <Label htmlFor="include-uppercase" className="text-sm">
                Incluir mayúsculas
              </Label>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
              />
              <Label htmlFor="include-numbers" className="text-sm">
                Incluir números
              </Label>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
              />
              <Label htmlFor="include-symbols" className="text-sm">
                Incluir símbolos
              </Label>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <Label className="text-sm mr-2">Longitud:</Label>
              <Slider
                min={8}
                max={32}
                step={1}
                value={[passwordLength]}
                onValueChange={(value) => setPasswordLength(value[0])}
                className="w-32 mx-2"
              />
              <span className="ml-2 text-sm text-muted-foreground">{passwordLength}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
