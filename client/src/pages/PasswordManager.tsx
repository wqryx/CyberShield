import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordGenerator } from "@/components/password-manager/PasswordGenerator";
import { PasswordList, Password } from "@/components/password-manager/PasswordList";
import { PasswordLeakChecker } from "@/components/password-manager/PasswordLeakChecker";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

const passwordFormSchema = z.object({
  site: z.string().min(1, { message: "El sitio es requerido" }),
  username: z.string().min(1, { message: "El usuario es requerido" }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  siteIcon: z.string().optional(),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function PasswordManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);

  const { data: passwords, isLoading } = useQuery<Password[]>({
    queryKey: ["/api/passwords"],
  });

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      site: "",
      username: "",
      password: "",
      siteIcon: "",
    },
  });

  const createPasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const url = editingPassword
        ? `/api/passwords/${editingPassword.id}`
        : "/api/passwords";
      const method = editingPassword ? "PATCH" : "POST";
      
      const response = await apiRequest(method, url, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      setIsDialogOpen(false);
      setEditingPassword(null);
      form.reset();
      toast({
        title: editingPassword ? "Contraseña actualizada" : "Contraseña guardada",
        description: editingPassword
          ? "La contraseña ha sido actualizada correctamente"
          : "La contraseña ha sido guardada de forma segura",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo guardar la contraseña",
        variant: "destructive",
      });
    },
  });

  const handleAddNewPassword = () => {
    form.reset({
      site: "",
      username: "",
      password: "",
      siteIcon: "",
    });
    setEditingPassword(null);
    setIsDialogOpen(true);
  };

  const handleEditPassword = (password: Password) => {
    form.reset({
      site: password.site,
      username: password.username,
      password: password.password,
      siteIcon: password.siteIcon,
    });
    setEditingPassword(password);
    setIsDialogOpen(true);
  };

  const onSubmit = (values: PasswordFormValues) => {
    createPasswordMutation.mutate(values);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">
            Gestor de Contraseñas
          </h1>
          <Button
            onClick={handleAddNewPassword}
            variant="default"
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Contraseña
          </Button>
        </div>

        <PasswordGenerator />

        <PasswordList
          passwords={passwords || []}
          onEdit={handleEditPassword}
        />

        <PasswordLeakChecker />
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPassword(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingPassword ? "Editar contraseña" : "Agregar nueva contraseña"}
            </DialogTitle>
            <DialogDescription>
              {editingPassword
                ? "Actualice los detalles de la contraseña guardada"
                : "Complete los detalles para guardar una nueva contraseña de forma segura"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sitio/Aplicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Google, Facebook, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario o Email</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Contraseña segura"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={createPasswordMutation.isPending}
                >
                  {createPasswordMutation.isPending
                    ? "Guardando..."
                    : editingPassword
                    ? "Actualizar"
                    : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
