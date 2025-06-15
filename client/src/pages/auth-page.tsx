import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, User, Eye, EyeOff, Loader2, Mail, ArrowLeft, Network } from "lucide-react";

// Esquemas de validación
const loginSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulario de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Formulario de registro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    const { username, email, password } = data;
    registerMutation.mutate({ username, email, password });
  }

  // Redireccionar si el usuario ya está autenticado
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header con botón de volver */}
      <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="ghost" className="gap-2 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-white">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Formulario */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-2xl border-0 bg-white/85 dark:bg-indigo-900/85 backdrop-blur-md border border-purple-200/30 dark:border-purple-700/30">
              <CardHeader className="space-y-3 text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-4 rounded-3xl shadow-lg">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CyberShield
                </CardTitle>
                <CardDescription className="text-base text-gray-700 dark:text-purple-200">
                  Tu plataforma de ciberseguridad personal
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8">
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 w-full mb-6 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800">
                    <TabsTrigger value="login" className="text-sm font-medium text-purple-700 dark:text-purple-200">Iniciar sesión</TabsTrigger>
                    <TabsTrigger value="register" className="text-sm font-medium text-purple-700 dark:text-purple-200">Registrarse</TabsTrigger>
                  </TabsList>

                  {/* Formulario de login */}
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input 
                                    className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400" 
                                    placeholder="Ingresa tu nombre de usuario" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input 
                                    className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Ingresa tu contraseña" 
                                    {...field} 
                                  />
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-xl" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Iniciando sesión...
                            </>
                          ) : (
                            'Iniciar sesión'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* Formulario de registro */}
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input 
                                    className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400" 
                                    placeholder="Elige un nombre de usuario" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input 
                                    className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400" 
                                    type="email" 
                                    placeholder="Ingresa tu correo electrónico" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input 
                                    className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Crea una contraseña segura" 
                                    {...field} 
                                  />
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contraseña</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input 
                                    className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400" 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirma tu contraseña" 
                                    {...field} 
                                  />
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-xl" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Registrando...
                            </>
                          ) : (
                            'Registrarse'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="pt-6 border-t mx-8 mb-8">
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 w-full">
                  {activeTab === "login" ? (
                    <>
                      ¿No tienes una cuenta?{" "}
                      <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-800 font-medium" onClick={() => setActiveTab("register")}>
                        Regístrate aquí
                      </Button>
                    </>
                  ) : (
                    <>
                      ¿Ya tienes una cuenta?{" "}
                      <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-800 font-medium" onClick={() => setActiveTab("login")}>
                        Inicia sesión
                      </Button>
                    </>
                  )}
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Sección visual mejorada */}
          <div className="hidden lg:flex flex-col justify-center p-8">
            <div className="max-w-lg space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl mb-6 shadow-2xl">
                  <Shield className="h-16 w-16 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4">
                  Protege tu mundo digital
                </h1>
                <p className="text-xl text-gray-700 dark:text-purple-200">
                  Herramientas avanzadas de ciberseguridad diseñadas para todos
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-white/60 dark:bg-indigo-800/60 rounded-2xl border border-purple-200/50 dark:border-purple-600/50 backdrop-blur-sm">
                  <div className="flex-shrink-0 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800 p-3 rounded-xl">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Gestor de Contraseñas</h3>
                    <p className="text-gray-700 dark:text-purple-200 text-sm">
                      Genera, almacena y gestiona contraseñas seguras con detección automática de vulnerabilidades
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/60 dark:bg-indigo-800/60 rounded-2xl border border-purple-200/50 dark:border-purple-600/50 backdrop-blur-sm">
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-800 dark:to-blue-800 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Simulador de Phishing</h3>
                    <p className="text-gray-700 dark:text-purple-200 text-sm">
                      Entrénate para identificar correos fraudulentos y sitios web maliciosos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/60 dark:bg-indigo-800/60 rounded-2xl border border-purple-200/50 dark:border-purple-600/50 backdrop-blur-sm">
                  <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 p-3 rounded-xl">
                    <Network className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Escáner de Red</h3>
                    <p className="text-gray-700 dark:text-purple-200 text-sm">
                      Analiza tu red doméstica en busca de dispositivos y vulnerabilidades
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span>Protección confiable para usuarios no técnicos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}