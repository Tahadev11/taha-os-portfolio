
export type Section =
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "contact"
  | "resume"
  | "certificates";

export const navigation: {
  label: string;
  command: string;
  section: Section;
}[] = [
  { label: "Home", command: "home", section: "home" },
  { label: "About", command: "about", section: "about" },
  { label: "Projects", command: "projects", section: "projects" },
  { label: "Skills", command: "skills", section: "skills" },
  { label: "Experience", command: "experience", section: "experience" },
  { label: "Education", command: "education", section: "education" },
  { label: "Resume", command: "resume", section: "resume" },
  { label: "Certificates", command: "certificates", section: "certificates" },
  { label: "Contact", command: "contact", section: "contact" },
];

export const defaultContent: Record<
  Section,
  { title: string; subtitle: string; description: string }
> = {
  home: {
    title: "Building digital experiences.",
    subtitle: "Software Engineer · Full-Stack Developer",
    description:
      "I build modern web applications, backend systems and practical digital products with a focus on clean architecture and useful user experiences.",
  },

  about: {
    title: "A little about me.",
    subtitle: "Curious mind. Developer mindset.",
    description:
      "I'm a Software Engineering graduate passionate about software development. I enjoy turning ideas into functional applications and continuously improving my engineering skills.",
  },

  projects: {
    title: "Things I've built.",
    subtitle: "Selected development projects",
    description:
      "Explore my software development projects and practical applications.",
  },

  skills: {
    title: "Tools of my trade.",
    subtitle: "Technologies and capabilities",
    description:
      "Explore the technologies and tools I use to build modern applications.",
  },

  experience: {
    title: "Learning by building.",
    subtitle: "Training and practical experience",
    description:
      "My journey includes hands-on software development projects and practical training.",
  },

  education: {
    title: "My learning journey.",
    subtitle: "Education and development",
    description:
      "Explore my academic background and educational journey.",
  },

  resume: {
    title: "My professional profile.",
    subtitle: "Resume and career overview",
    description:
      "Explore my technical background, education, projects and professional qualifications.",
  },

  certificates: {
    title: "Learning never stops.",
    subtitle: "Professional certificates and achievements",
    description:
      "Explore my certifications, completed courses and continuous learning achievements.",
  },

  contact: {
    title: "Let's build something.",
    subtitle: "Have an idea or opportunity?",
    description:
      "I'm open to discussing software projects, development opportunities and collaborations. Feel free to get in touch.",
  },
};
