export interface ContactItem {
  name: string;
  link: string;
  icon: string;
  text: string;
}

export interface BasicListItem {
  name: string;
  url?: string;
  location?: string;
  role?: string;
  dates: string;
  desc: string;
  extendedDesc?: string;
  hideOnPrint?: boolean;
}

export interface LanguagesListItem {
  name: string;
  url?: string;
  dates?: string;
  desc: string;
  languages: string[];
}

export interface ResumeData {
  me: string;
  experience: BasicListItem[];
  education: BasicListItem[];
  freelance: LanguagesListItem[];
  projects: LanguagesListItem[];
  volunteering: LanguagesListItem[];
  talks: BasicListItem[];
}

export interface AboutData {
  me: string;
  internet: string;
}
