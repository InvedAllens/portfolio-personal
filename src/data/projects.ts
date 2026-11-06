export type Project = {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  technologies: string[];
  demo: string;
  repository: string;
  featured?: boolean;
};

// Datos y enlaces tomados del ZIP original del portafolio. Los enlaces externos pueden cambiar.
export const projects: Project[] = [
  {
    id: 'appsalon',
    title: 'Gestión de citas para barbería',
    summary: 'Aplicación PHP MVC para registrar citas, seleccionar servicios y administrar reservas y catálogo con operaciones CRUD.',
    image: 'appsalon_captura_tablet', imageWidth: 1536, imageHeight: 2048,
    technologies: ['PHP', 'MySQL', 'JavaScript', 'Sass', 'MVC'],
    demo: 'https://appsalon-aldo-allen.alwaysdata.net/',
    repository: 'https://github.com/InvedAllens/appsalon_mvc',
    featured: true,
  },
  {
    id: 'bienes-raices',
    title: 'Administración de bienes raíces',
    summary: 'Sitio inmobiliario con gestión de propiedades y vendedores, autenticación administrativa y arquitectura MVC.',
    image: 'bienesraices_captura_tablet', imageWidth: 1536, imageHeight: 1898,
    technologies: ['PHP', 'MySQL', 'Sass', 'MVC'],
    demo: 'https://appsalon-aldo-allen.alwaysdata.net/bienes-raices/',
    repository: 'https://github.com/InvedAllens/bienes_raices_mvc',
    featured: true,
  },
  {
    id: 'encriptador',
    title: 'Encriptador de texto',
    summary: 'Herramienta de encriptación y desencriptación desarrollada como desafío de Oracle Next Education y Alura.',
    image: 'encriptador_challenge', imageWidth: 2048, imageHeight: 2168,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    demo: 'https://invedallens.github.io/encriptador-de-texto/',
    repository: 'https://github.com/InvedAllens/encriptador-de-texto',
    featured: true,
  },
  {
    id: 'gastos',
    title: 'Control de gastos',
    summary: 'Aplicación de finanzas personales con registro, edición, eliminación y filtros por categoría; guarda los datos localmente.',
    image: 'controldegastos_vtablet', imageWidth: 1536, imageHeight: 1898,
    technologies: ['React', 'Vite', 'JavaScript'],
    demo: 'https://controldegastos-aldoallens.netlify.app/',
    repository: 'https://github.com/InvedAllens/control-de-gastos',
  },
  {
    id: 'veterinaria',
    title: 'Seguimiento de pacientes veterinarios',
    summary: 'Gestión de pacientes, observaciones y citas veterinarias con persistencia local.',
    image: 'veterinaria_citas_tablet', imageWidth: 1536, imageHeight: 1418,
    technologies: ['React', 'Vite', 'JavaScript'],
    demo: 'https://pacientes-react-aldoallens.netlify.app/',
    repository: 'https://github.com/InvedAllens/veterinaria-citas',
  },
  {
    id: 'criptomonedas',
    title: 'Cotizador de criptomonedas',
    summary: 'Consulta de precios e información de criptomonedas mediante la API de CryptoCompare.',
    image: 'cotizadorMonedas_vportatil', imageWidth: 2048, imageHeight: 1898,
    technologies: ['React', 'JavaScript', 'API'],
    demo: 'https://cotizadorcriptomonedas-aldoallens.netlify.app/',
    repository: 'https://github.com/InvedAllens/cotizador-criptomonedas',
  },
  {
    id: 'festival',
    title: 'Festival musical',
    summary: 'Sitio estático para presentar un evento cultural, con galería y recursos visuales optimizados.',
    image: 'festival-musical', imageWidth: 2048, imageHeight: 1898,
    technologies: ['HTML', 'CSS', 'JavaScript', 'Sass'],
    demo: 'https://invedallens.github.io/festival-musical/',
    repository: 'https://github.com/InvedAllens/festival-musical',
  },
];
