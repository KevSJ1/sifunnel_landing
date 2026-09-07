# SiFunnel

<p align="center">
  <img src="./public/inbox-doodle.svg" alt="Ilustración del buzón de mensajes de SiFunnel" width="720">
</p>

<p align="center">
  CRM autohospedable para equipos que gestionan conversaciones de WhatsApp,
  contactos, ventas y automatizaciones desde un mismo lugar.
</p>

## Características

- **Buzón compartido** para trabajar conversaciones de WhatsApp Business con
  varios agentes, asignaciones, estados, notas y presencia en tiempo real.
- **Contactos y etiquetas** con importación CSV, deduplicación y campos
  personalizados.
- **Pipelines de ventas** con tablero Kanban y negocios vinculados a
  conversaciones.
- **Difusiones** con plantillas aprobadas por Meta, sustitución de variables y
  seguimiento de entrega y lectura.
- **Automatizaciones visuales** para mensajes entrantes, contactos nuevos,
  palabras clave, horarios, etiquetas, webhooks y esperas.
- **Asistente de IA opcional** con claves propias de OpenAI o Anthropic,
  respuestas sugeridas, respuestas automáticas y base de conocimiento.
- **Cuentas de equipo** con invitaciones y roles de propietario, administrador,
  agente y lector.
- **API REST pública** con claves revocables y permisos por alcance.
- **Servidor MCP** para conectar la instancia con asistentes compatibles con
  Model Context Protocol.

## Tecnología

- Next.js 16, React 19 y TypeScript
- Tailwind CSS 4
- Supabase para PostgreSQL, autenticación, almacenamiento y tiempo real
- Meta WhatsApp Cloud API
- Vitest para pruebas

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Un proyecto de Supabase
- Una aplicación y una cuenta de WhatsApp Business en Meta para usar la
  integración de WhatsApp

## Instalación local

```bash
git clone https://github.com/<tu-usuario>/SIFUNNEL.git
cd SIFUNNEL
npm install
```

En Windows PowerShell:

```powershell
Copy-Item .env.local.example .env.local
```

En Linux o macOS:

```bash
cp .env.local.example .env.local
```

Completa `.env.local` con los valores de Supabase y los secretos del servidor.
Después inicia la aplicación:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Las variables públicas de Supabase se necesitan para que el cliente pueda
conectarse. Las claves restantes solo deben existir en el servidor.

Variables principales:

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones protegidas del servidor |
| `ENCRYPTION_KEY` | Cifra tokens y claves guardados en la base de datos |
| `META_APP_SECRET` | Valida la firma de los webhooks de Meta |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clave pública de Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Validación de Turnstile en el servidor |

Consulta [.env.local.example](./.env.local.example) para ver todas las
variables opcionales.

### Configuración de WhatsApp

Las credenciales de WhatsApp son específicas de cada cuenta y **no se leen
desde variables `WHATSAPP_*`**. Después de iniciar sesión, ve a
**Configuración → WhatsApp** y guarda:

- Phone Number ID
- WABA ID
- Access Token
- Verify Token
- PIN de verificación de dos pasos, cuando Meta lo solicite

El token se cifra antes de guardarse en Supabase. Mantén el mismo
`ENCRYPTION_KEY` en todos los reinicios y despliegues; si cambia, los tokens
guardados no podrán descifrarse y será necesario volver a introducirlos.

## Supabase

Aplica las migraciones en orden desde la carpeta
[`supabase/migrations`](./supabase/migrations). Las migraciones no se ejecutan
automáticamente al iniciar la aplicación.

La base de datos utiliza RLS y organiza los datos por cuenta. El usuario que
configure WhatsApp debe tener permisos de administrador o propietario.

## Ejecución con Docker

El proyecto incluye un `Dockerfile` y Docker Compose. Configura primero
`.env.local` y ejecuta:

```bash
docker compose --env-file .env.local up --build -d
```

La aplicación estará disponible en `http://localhost:3000`. Para cambiar el
puerto publicado, usa `HOST_PORT` en `.env.local`.

Consulta [docs/docker.md](./docs/docker.md) para conocer la diferencia entre
variables de compilación y variables de ejecución.

## Comandos útiles

```bash
npm run dev           # servidor de desarrollo
npm run build         # compilación de producción
npm run start         # iniciar la compilación
npm run lint          # revisar ESLint
npm run typecheck     # revisar TypeScript
npm test              # ejecutar las pruebas
```

## API y MCP

La API pública está documentada en [docs/public-api.md](./docs/public-api.md).
Permite gestionar contactos, conversaciones, mensajes y difusiones mediante
claves creadas desde **Configuración → Claves API**.

El servidor MCP está en [`mcp-server/`](./mcp-server). Consulta su
[README](./mcp-server/README.md) para instalarlo y configurar el acceso a una
instancia de SiFunnel.

## Estructura principal

```text
src/app/              Páginas y rutas API de Next.js
src/components/       Componentes de la interfaz
src/hooks/             Hooks de React
src/lib/               Lógica de negocio e integración con Meta y Supabase
src/types/             Tipos compartidos
supabase/migrations/   Esquema y migraciones de la base de datos
docs/                  Documentación técnica
mcp-server/            Servidor MCP opcional
```

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta [LICENSE](./LICENSE).