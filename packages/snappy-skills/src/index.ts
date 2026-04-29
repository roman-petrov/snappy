export const Skills = import.meta.glob<string>(`./skills/*.md`, { eager: true, import: `default`, query: `?raw` });
