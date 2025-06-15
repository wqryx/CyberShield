import { Link } from "wouter";
import { Shield, Lock, Network, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/70 dark:bg-indigo-900/70 backdrop-blur-sm sticky top-0 z-50 border-purple-200/50 dark:border-purple-700/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CyberShield</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900">
              <Link href="/auth">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Link href="/auth">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Protege tu mundo digital con{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CyberShield</span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Una plataforma de ciberseguridad avanzada diseñada para usuarios no técnicos. 
              Simplificamos la protección digital con herramientas intuitivas y fáciles de usar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                <Link href="/auth">Comenzar Gratis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900">
                <Link href="#features">Conocer Más</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-white via-indigo-50 to-purple-100 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4">
              Herramientas de Seguridad Completas
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Todo lo que necesitas para mantener tu información y dispositivos seguros en un solo lugar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-300 transition-colors bg-white/70 dark:bg-indigo-900/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-800 rounded-full w-fit">
                  <Lock className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Gestión de Contraseñas</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Genera, almacena y gestiona contraseñas seguras para todas tus cuentas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Generador de contraseñas seguras
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Detección de contraseñas comprometidas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Análisis de fortaleza de contraseñas
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-300 transition-colors bg-white/70 dark:bg-indigo-900/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-full w-fit">
                  <AlertTriangle className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Simulador de Phishing</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Aprende a identificar y protegerte de ataques de phishing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ejemplos realistas de emails de phishing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Entrenamiento interactivo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Estadísticas de progreso
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors bg-white/70 dark:bg-indigo-900/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-800 dark:to-blue-800 rounded-full w-fit">
                  <Network className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Análisis de Red</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Escanea y monitorea la seguridad de tu red doméstica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Detección automática de dispositivos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Identificación de vulnerabilidades
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Recomendaciones de seguridad
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-6">
                ¿Por qué elegir CyberShield?
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Diseñado para todos
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      No necesitas ser un experto en tecnología. Nuestra interfaz intuitiva 
                      hace que la ciberseguridad sea accesible para todos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Protección integral
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Cubre todos los aspectos esenciales de la seguridad digital: 
                      contraseñas, phishing y seguridad de red.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Fácil de usar
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Herramientas poderosas con una experiencia de usuario simple y clara. 
                      Comienza a protegerte en minutos, no en horas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="text-center">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-90" />
                  <h4 className="text-2xl font-bold mb-4">
                    ¡Protege tu vida digital hoy!
                  </h4>
                  <p className="mb-6 opacity-95">
                    Únete a miles de usuarios que ya confían en CyberShield 
                    para mantener sus datos seguros.
                  </p>
                  <Button asChild variant="secondary" size="lg" className="bg-white text-purple-700 hover:bg-gray-100 shadow-lg">
                    <Link href="/auth">Comenzar Ahora</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-purple-300" />
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">CyberShield</span>
            </div>
            <div className="text-purple-200 text-sm">
              © 2024 CyberShield. Protegiendo tu mundo digital.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}