export const demoRooms = [
  {
    id: "101",
    roomNumber: "101",
    name: "Apartamento Casal",
    shortDescription: "Uma opção prática para descansar com conforto.",
    description: "Quarto pensado para uma estadia tranquila, com cama de casal, ar-condicionado e itens essenciais para a sua rotina em Goiânia.",
    imageUrl: "images/suite-casal.png",
    status: "livre",
    amenities: ["Cama de casal", "Ar-condicionado", "Wi-Fi", "Toalhas"],
  },
  {
    id: "102",
    roomNumber: "102",
    name: "Apartamento Duplo",
    shortDescription: "Para viajar acompanhado com mais espaço.",
    description: "Uma acomodação para quem divide a viagem e quer aproveitar uma noite confortável, com camas separadas e ambiente funcional.",
    imageUrl: "images/quarto-duplo.png",
    status: "livre",
    amenities: ["Duas camas", "Ar-condicionado", "Wi-Fi", "Cortinas blackout"],
  },
  {
    id: "201",
    roomNumber: "201",
    name: "Apartamento com TV",
    shortDescription: "Praticidade para uma parada rápida ou viagem a trabalho.",
    description: "Um quarto funcional para fazer uma pausa, com televisão, frigobar e armário para organizar a sua estadia.",
    imageUrl: "images/quarto-com-tv.png",
    status: "manutencao",
    amenities: ["TV", "Frigobar", "Ar-condicionado", "Armário"],
  },
];

export const statusInfo = {
  livre: { label: "Livre", className: "status-livre" },
  manutencao: { label: "Manutenção", className: "status-manutencao" },
  ocupado: { label: "Ocupado", className: "status-ocupado" },
};

export function normalizeRoom(id, data) {
  return {
    id,
    roomNumber: data.roomNumber ?? "—",
    name: data.name ?? "Quarto",
    shortDescription: data.shortDescription ?? "",
    description: data.description ?? "",
    imageUrl: data.imageUrl ?? "images/suite-casal.png",
    status: statusInfo[data.status] ? data.status : "livre",
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
  };
}

export function roomImage(room, assetPrefix = "") {
  if (/^(https?:|data:)/i.test(room.imageUrl)) return room.imageUrl;
  return `${assetPrefix}${room.imageUrl.replace(/^\//, "")}`;
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  })[char]);
}
