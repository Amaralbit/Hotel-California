import {
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  orderBy,
  query,
} from "./firebase-service.js";
import {
  demoRooms,
  escapeHtml,
  normalizeRoom,
  roomImage,
  statusInfo,
} from "./room-data.js";

const roomGrid = document.querySelector("#room-grid");
const roomNotice = document.querySelector("#room-notice");
const assetPrefix = document.body.dataset.assetPrefix ?? "";

function renderRooms(rooms) {
  if (!rooms.length) {
    roomGrid.innerHTML = '<div class="empty-state">Ainda não há quartos cadastrados. Volte em breve ou fale conosco para consultar a disponibilidade.</div>';
    return;
  }

  roomGrid.innerHTML = rooms.map((room) => {
    const status = statusInfo[room.status];
    return `
      <article class="room-card">
        <a class="room-card-image" href="quarto.html?id=${encodeURIComponent(room.id)}" aria-label="Ver detalhes do quarto ${escapeHtml(room.roomNumber)}">
          <img src="${escapeHtml(roomImage(room, assetPrefix))}" alt="${escapeHtml(room.name)}" />
          <span class="room-number">Quarto ${escapeHtml(room.roomNumber)}</span>
        </a>
        <div class="room-card-body">
          <span class="status ${status.className}">${status.label}</span>
          <h3>${escapeHtml(room.name)}</h3>
          <p>${escapeHtml(room.shortDescription)}</p>
          <a class="card-link" href="quarto.html?id=${encodeURIComponent(room.id)}">Ver quarto <span aria-hidden="true">↗</span></a>
        </div>
      </article>`;
  }).join("");
}

async function loadRooms() {
  if (!isFirebaseConfigured) {
    roomNotice.classList.remove("hidden");
    roomNotice.textContent = "Catálogo demonstrativo: assim que o Firebase for conectado, os quartos e status serão atualizados pelo painel do proprietário.";
    renderRooms(demoRooms);
    return;
  }

  try {
    const snapshot = await getDocs(query(collection(db, "rooms"), orderBy("roomNumber")));
    renderRooms(snapshot.docs.map((room) => normalizeRoom(room.id, room.data())));
  } catch (error) {
    roomNotice.classList.remove("hidden");
    roomNotice.textContent = "Não foi possível carregar os quartos agora. Tente novamente em instantes.";
    renderRooms([]);
    console.error(error);
  }
}

loadRooms();
