export const siteConfig = {
  brokerName: "Breno Archanjo",
  creci: "193.491",
  yearsActive: 10,
  phoneDisplay: "(12) 98890-4211",
  whatsappNumber: "5512988904211",
  email: "breno@imoveisarchanjo.com.br",
  instagram: "@brenoarchanjo",
  instagramUrl: "https://instagram.com/brenoarchanjo",
  specialties: ["Formação", "Inteligência Artificial", "Lançamentos", "Criação de sites"],
  region: "São José dos Campos",
  shortBio:
    "Corretor especialista em transformar a presença digital de outros corretores.",
  stats: {
    propertiesSold: 536,
    sitesCreated: 56,
  },
  siteName: "Imóveis Archanjo",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
