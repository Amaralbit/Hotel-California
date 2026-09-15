import {
  db,
  doc,
  getDoc,
  isFirebaseConfigured,
} from "./firebase-service.js";
import { ownerWhatsAppNumber } from "./firebase-config.js";
import {
  demoRooms,
  escapeHtml,
  normalizeRoom,
  roomImage,
  statusInfo,
} from "./room-data.js";

const detail = document.querySelector("#room-detail");
const assetPrefix = document.body.dataset.assetPrefix ?? "";
const roomId = new URLSearchParams(window.location.search).get("id");

function renderNotFound() {
  detail.innerHTML = `
    <div class="empty-state">
      Quarto não encontrado. <a class="card-link" href="quartos.html">Voltar para os quartos</a>
    </div>`;
}

function renderRoom(room) {
  const status = statusInfo[room.status];
  const isAvailable = room.status === "livre";
  const message = `Olá! Quero agendar o quarto ${room.roomNumber} — ${room.name}, do Hotel California.`;
  const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(message)}`;
  const amenities = room.amenities.length ? room.amenities : ["Consulte a recepção para mais detalhes"];

  detail.innerHTML = `
    <a class="back-link" href="quartos.html">← Ver todos os quartos</a>
    <div class="detail-grid">
      <div class="detail-photo"><img src="${escapeHtml(roomImage(room, assetPrefix))}" alt="${escapeHtml(room.name)}" /></div>
      <div class="detail-copy">
        <span class="eyebrow">Quarto ${escapeHtml(room.roomNumber)}</span>
        <h1>${escapeHtml(room.name)}</h1>
        <div class="detail-meta"><span class="status ${status.className}">${status.label}</span></div>
        <p>${escapeHtml(room.description || room.shortDescription)}</p>
        <ul class="amenities">${amenities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        ${isAvailable
          ? `<a class="button" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Agendar este quarto no WhatsApp <span aria-hidden="true">↗</span></a>`
          : `<button class="button" type="button" disabled>Quarto indisponível no momento</button>`}
      </div>
    </div>`;
}

async function loadRoom() {
  if (!roomId) {
    renderNotFound();
    return;
  }

  if (!isFirebaseConfigured) {
    const room = demoRooms.find((item) => item.id === roomId);
    if (room) renderRoom(room);
    else renderNotFound();
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "rooms", roomId));
    if (snapshot.exists()) renderRoom(normalizeRoom(snapshot.id, snapshot.data()));
    else renderNotFound();
  } catch (error) {
    console.error(error);
    renderNotFound();
  }
}

loadRoom();
