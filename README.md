# CAUOR · Sitio web del Colegio de Auditores de Oruro

Base del proyecto: Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma.

## Puesta en marcha (desarrollo)

Requisitos: Node.js 20 o superior y Docker.

```bash
cp .env.example .env          # completa SESSION_SECRET y SEED_ADMIN_CLAVE
openssl rand -base64 48       # sirve para generar SESSION_SECRET
docker compose up -d          # levanta PostgreSQL
npm install
npx prisma migrate dev --name init
npm run db:seed               # crea el administrador y la configuración inicial
npm run dev                   # http://localhost:3000
```

## Qué incluye esta base

| Archivo | Para qué sirve |
|---|---|
| `prisma/schema.prisma` | Todas las tablas: usuarios, colegiados, cuotas, pagos, tienda, QR, institución, galería, eventos, auditoría |
| `prisma/seed.ts` | Administrador inicial, monto de mensualidad, misión y visión, órganos y los 2 QR |
| `src/lib/auth.ts` | Contraseñas con argon2id y sesión en cookie HttpOnly firmada |
| `src/middleware.ts` | Protege `/panel` (colegiados) y `/admin` (administradores) por rol |
| `src/app/api/auth/*` | Inicio y cierre de sesión, con bloqueo tras 5 intentos fallidos |
| `src/lib/storage.ts` | Guarda comprobantes fuera de la carpeta pública, valida el tipo real y evita duplicados |

## Hoja de ruta

1. Pasar las vistas del prototipo a componentes: encabezado, menú, portada, noticias, cursos, tienda, guía, institución, nosotros, galería.
2. Página de ingreso conectada a `/api/auth/login`.
3. Panel del colegiado: perfil editable, estado de cuenta, pago con QR y subida de comprobante.
4. Panel del administrador: colegiados, importación Excel/CSV, validación de pagos, QR, contenido.
5. Servir comprobantes solo a su dueño y a administradores (endpoint autenticado).
6. Despliegue: VPS con Nginx y HTTPS, copias de seguridad diarias de la base y de `storage/`.

## Seguridad: reglas del proyecto

- Todas las consultas pasan por Prisma (parametrizadas): no se concatena SQL.
- La autorización se verifica en el servidor en cada acción; ocultar un botón no basta.
- El colegiado solo accede a sus propios datos y no puede editar registros ni fechas de título.
- Cada acción del administrador (validar pago, cambiar estado, importar) se anota en `Auditoria`.
- `.env` y `storage/` nunca se suben al repositorio.

## Vistas públicas (hecho)

Inicio, Nosotros, Institución (Directorio, Tribunal, Consejo), Guía de profesionales, Galería, Cursos y eventos,
Tienda virtual e Ingresar viven en `src/app/(publico)/`. Encabezado, menú, pie y componentes en `src/components/`.

- Los textos y fotos salen de la base de datos; si algo está vacío, la página muestra un aviso en vez de fallar.
- Las fotos públicas (galería, afiches, miembros, productos) se guardan en `STORAGE_DIR/media/…` y se sirven en `/api/media/…`.
  Los comprobantes de pago NO están en esa carpeta y no se sirven por ahí.
- La Guía consulta solo campos públicos (nunca estado ni deudas).
- Mejora pendiente: búsqueda sin distinguir tildes (requiere la extensión `unaccent` de PostgreSQL).
- Para cambiar colores y tipografías: `tailwind.config.ts`. Para cambiar el menú: `src/lib/nav.ts`.

## Usuarios, permisos y contenido (oct 2026)

- **Usuario del colegiado:** se genera una sola vez con `generarUsername()` (`src/lib/usuarios.ts`): iniciales en mayúsculas de
  nombres y apellidos + registro CAUOR. Ejemplo: María Fernanda Apaza Quispe, registro 0123 → `MFAQ0123`. No existe ninguna ruta para cambiarlo.
- **Contraseña inicial:** `generarClaveTemporal()` crea una clave aleatoria de 10 caracteres. El administrador la ve una sola vez
  (puede imprimirla o copiarla) y el colegiado debe cambiarla en su primer ingreso (`/api/auth/cambiar-clave`).
  Es "genérica" en el sentido de temporal, pero no igual para todos: así nadie puede adivinar la de otro colegiado.
- **Administradores delegados:** tabla `PermisoAdmin` (galería, cursos, tienda, pagos). Entran con su mismo usuario de colegiado.
  El middleware solo deja pasar a `/admin`; **cada acción del servidor debe volver a comprobar el permiso exacto**.
  Gestión de colegiados, QR, monto de la mensualidad y delegados: solo el rol `ADMIN`.
- **Contacto público:** el colegiado elige qué datos mostrar (`mostrarEmail`, `mostrarTelefono`, `mostrarTelefono2`, `mostrarDireccion`).
  La Guía solo muestra lo marcado. La dirección viene desmarcada por defecto.
- **Galería:** `Album` + `FotoAlbum` (varias fotos por evento).
- **Tienda:** productos con `pideGeneroTalla` usan `VarianteProducto` (género, talla, stock por combinación).
- Pendiente: página de detalle de cada noticia (hoy las tarjetas de noticias enlazan al inicio).

## Portada y bandas a todo el ancho

- **Carrusel:** lee la tabla `Banner` (título, texto, botón, enlace, imagen, orden, activo). El administrador puede cambiar la imagen de cada
  diapositiva, agregar más y reordenarlas. Mientras no haya ninguna, se usan 3 diapositivas por defecto con recortes distintos de `public/oruro.jpg`.
- **Bandas "Acceso para colegiados" y "Guía de profesionales":** componente `BandaCompleta`, con las imágenes difuminadas en azul
  `public/acceso.jpg` y `public/guia.jpg` (se pueden reemplazar por otras).
- Noticias, cursos, tienda e institución usan todo el ancho de la pantalla (`Seccion.tsx`).
