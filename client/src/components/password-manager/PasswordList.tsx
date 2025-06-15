import { useState } from "react";
import { Eye, EyeOff, Copy, Edit, Trash, Search } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPasswordStrength } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface Password {
  id: string;
  site: string;
  username: string;
  password: string;
  siteIcon: string;
  lastUpdated: string;
}

interface PasswordListProps {
  passwords: Password[];
  onEdit: (password: Password) => void;
}

export function PasswordList({ passwords, onEdit }: PasswordListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: "La información ha sido copiada",
    });
  };

  const deletePasswordMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/passwords/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Contraseña eliminada",
        description: "La contraseña ha sido eliminada correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la contraseña",
        variant: "destructive",
      });
    },
  });

  const handleDeletePassword = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta contraseña?")) {
      deletePasswordMutation.mutate(id);
    }
  };

  const filteredPasswords = passwords.filter(
    (password) =>
      password.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (siteIcon: string) => {
    // This would be replaced with actual icons in a production app
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
        <span className="text-blue-600 text-xs">{siteIcon.substring(0, 2)}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Mis contraseñas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contraseñas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Sitio/App
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Usuario
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Contraseña
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Seguridad
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {filteredPasswords.map((password) => {
                const { strength, label } = getPasswordStrength(password.password);
                let strengthColorClass = "bg-red-500";
                let strengthTextClass = "text-red-600";
                
                if (strength >= 85) {
                  strengthColorClass = "bg-green-500";
                  strengthTextClass = "text-green-600";
                } else if (strength >= 60) {
                  strengthColorClass = "bg-yellow-500";
                  strengthTextClass = "text-yellow-600";
                }

                return (
                  <TableRow key={password.id} className="hover:bg-muted/50">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center">
                        {getIconComponent(password.siteIcon)}
                        <span className="text-sm">{password.site}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                      {password.username}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center">
                        <Input
                          type={visiblePasswords[password.id] ? "text" : "password"}
                          className="border-none bg-transparent"
                          value={visiblePasswords[password.id] ? password.password : "••••••••••"}
                          readOnly
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          onClick={() => togglePasswordVisibility(password.id)}
                          title={visiblePasswords[password.id] ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {visiblePasswords[password.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => copyToClipboard(password.password)}
                          title="Copiar contraseña"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className={`${strengthColorClass} h-2 rounded-full`}
                            style={{ width: `${strength}%` }}
                          ></div>
                        </div>
                        <span className={`ml-2 text-xs ${strengthTextClass}`}>
                          {label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-blue-700"
                          onClick={() => onEdit(password)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePassword(password.id)}
                          title="Eliminar"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
