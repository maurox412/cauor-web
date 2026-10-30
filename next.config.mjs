/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite que la compilación termine exitosamente incluso si hay errores de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite la compilación incluso si hay advertencias de linter
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;