export const profile = {
  name: 'Aldo Allende',
  about: [
    'Hola, soy Aldo. Soy originario de Ciudad de México y desarrollo proyectos web de manera independiente. Estudié Ingeniería Eléctrica Electrónica en la UNAM y he mantenido una formación continua en programación y desarrollo de aplicaciones.',
    'Me gusta especialmente el frontend porque combina creatividad, diseño y resolución de problemas. También me interesan la música, la animación y los videojuegos.',
  ],
  github: 'https://github.com/InvedAllens',
  linkedin: 'https://www.linkedin.com/in/aldo-allende-428b90173/',
  email: 'aldoallende1@hotmail.com',
  // El endpoint se conserva del portafolio original. Comprobar su vigencia antes de publicar.
  formspree: 'https://formspree.io/f/moqzlvkn',
} as const;

export const skillGroups = [
  { title: 'Lenguajes', skills: ['JavaScript', 'Java', 'PHP'] },
  { title: 'Frontend', skills: ['HTML', 'CSS3', 'React', 'Sass', 'Git'] },
  { title: 'Otras tecnologías', skills: ['Android', 'MATLAB', 'SQL', 'Arduino', 'Google Cloud'] },
] as const;

type TimelineEntry = { title: string; detail: string; current?: boolean };

export const experience: TimelineEntry[] = [
  { title: 'Desarrollador frontend', detail: 'Freelance', current: true },
  { title: 'Desarrollador web junior', detail: 'Softel S.A. de C.V.' },
  { title: 'Becario de sistemas', detail: 'Diario Milenio' },
];

export const education: TimelineEntry[] = [
  { title: 'Oracle Next Education · Alura', detail: 'Formación en frontend', current: true },
  { title: 'Ingeniería Eléctrica Electrónica', detail: 'Facultad de Ingeniería · UNAM' },
  { title: 'Formación autodidacta', detail: 'PROTECO, Coursera y Udemy' },
];
