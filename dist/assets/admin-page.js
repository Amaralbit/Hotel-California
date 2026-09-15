import {
  addDoc,
  auth,
  collection,
  createUserWithEmailAndPassword,
  db,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  isFirebaseConfigured,
  onAuthStateChanged,
  orderBy,
  ownerBootstrapEmail,
  query,
  ref,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  storage,
  updateDoc,
  uploadBytes,
} from "./firebase-service.js";
import { escapeHtml, normalizeRoom, roomImage, statusInfo } from "./room-data.js";

const setupMessage = document.querySelector("#setup-message");
const authSection = document.querySelector("#auth-section");
const dashboard = document.querySelector("#dashboard");
const authForm = document.querySelector("#auth-form");
const authTitle = document.querySelector("#auth-title");
const authSubmit = document.querySelector("#auth-submit");
const authToggle = document.querySelector("#auth-toggle");
const authMessage = document.querySelector("#auth-message");
const roomForm = document.querySelector("#room-form");
const roomMessage = document.querySelector("#room-message");
const roomList = document.querySelector("#admin-room-list");
const signOutButton = document.querySelector("#sign-out");
const cancelEditButton = document.querySelector("#cancel-edit");
const formHeading = document.querySelector("#form-heading");

let signupMode = false;
let editingId = null;
let rooms = [];
let activeUser = null;

function showMessage(element, text, type = "error") {
  element.textContent = text;
  element.className = `message ${type}`;
  element.classList.remove("hidden");
}

function clearMessage(element) {
  element.textContent = "";
  element.className = "message hidden";
}

function humanizeError(error) {
  const messages = {
    "auth/email-already-in-use": "Este e-mail já possui uma conta. Faça login.",
    "auth/invalid-credential": "E-mail ou senha inválidos.",
    "auth/weak-password": "Escolha uma senha com pelo menos 6 caracteres.",
    "auth/invalid-email": "Informe um e-mail válido.",
    "permission-denied": "Sua conta não tem permissão para realizar esta ação.",
  };
  return messages[error?.code] ?? "Não foi possível concluir a ação. Revise os dados e tente novamente.";
}

function setSignupMode(enabled) {
  signupMode = enabled;
  authTitle.textContent = enabled ? "Criar conta do proprietário" : "Entrar no painel";
  authSubmit.textContent = enabled ? "Criar conta" : "Entrar";
  authToggle.textContent = enabled ? "Já tenho uma conta" : "Criar a conta do proprietário";
  clearMessage(authMessage);
}

async function userIsOwner(user) {
  const profile = await getDoc(doc(db, "users", user.uid));
  return profile.exists() && profile.data().role === "owner";
}

function renderRoomList() {
  if (!rooms.length) {
    roomList.innerHTML = '<div class="empty-state">Nenhum quarto cadastrado. Use o formulário para criar o primeiro.</div>';
    return;
  }

  roomList.innerHTML = rooms.map((room) => {
    const status = statusInfo[room.status];
    const assetPrefix = document.body.dataset.assetPrefix ?? "";
    return `
      <article class="admin-room">
        <img src="${escapeHtml(roomImage(room, assetPrefix))}" alt="${escapeHtml(room.name)}" />
        <div>
          <strong>Quarto ${escapeHtml(room.roomNumber)} · ${escapeHtml(room.name)}</strong>
          <span class="status ${status.className}">${status.label}</span>
        </div>
        <button class="button button-secondary edit-room" type="button" data-room-id="${escapeHtml(room.id)}">Editar</button>
      </article>`;
  }).join("");

  roomList.querySelectorAll(".edit-room").forEach((button) => {
    button.addEventListener("click", () => beginEdit(button.dataset.roomId));
  });
}

async function loadRooms() {
  const snapshot = await getDocs(query(collection(db, "rooms"), orderBy("roomNumber")));
  rooms = snapshot.docs.map((item) => normalizeRoom(item.id, item.data()));
  renderRoomList();
}

function resetRoomForm() {
  editingId = null;
  roomForm.reset();
  formHeading.textContent = "Cadastrar quarto";
  roomForm.querySelector("[name=status]").value = "livre";
  cancelEditButton.classList.add("hidden");
  clearMessage(roomMessage);
}

function beginEdit(roomId) {
  const room = rooms.find((item) => item.id === roomId);
  if (!room) return;
  editingId = room.id;
  formHeading.textContent = `Editar quarto ${room.roomNumber}`;
  roomForm.querySelector("[name=roomNumber]").value = room.roomNumber;
  roomForm.querySelector("[name=name]").value = room.name;
  roomForm.querySelector("[name=shortDescription]").value = room.shortDescription;
  roomForm.querySelector("[name=description]").value = room.description;
  roomForm.querySelector("[name=imageUrl]").value = room.imageUrl.startsWith("http") ? room.imageUrl : "";
  roomForm.querySelector("[name=status]").value = room.status;
  roomForm.querySelector("[name=amenities]").value = room.amenities.join(", ");
  cancelEditButton.classList.remove("hidden");
  roomForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function uploadRoomImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const imageRef = ref(storage, `rooms/${Date.now()}-${safeName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

async function saveRoom(event) {
  event.preventDefault();
  clearMessage(roomMessage);
  const formData = new FormData(roomForm);
  const currentRoom = rooms.find((item) => item.id === editingId);
  const imageFile = formData.get("imageFile");
  let imageUrl = formData.get("imageUrl").trim() || currentRoom?.imageUrl || "images/suite-casal.png";

  try {
    if (imageFile instanceof File && imageFile.size) {
      imageUrl = await uploadRoomImage(imageFile);
    }

    const data = {
      roomNumber: formData.get("roomNumber").trim(),
      name: formData.get("name").trim(),
      shortDescription: formData.get("shortDescription").trim(),
      description: formData.get("description").trim(),
      imageUrl,
      status: formData.get("status"),
      amenities: formData.get("amenities").split(",").map((item) => item.trim()).filter(Boolean),
      updatedAt: serverTimestamp(),
    };

    if (!data.roomNumber || !data.name || !data.description) {
      showMessage(roomMessage, "Preencha número, nome e descrição do quarto.");
      return;
    }

    if (editingId) {
      await updateDoc(doc(db, "rooms", editingId), data);
      showMessage(roomMessage, "Quarto atualizado com sucesso.", "success");
    } else {
      await addDoc(collection(db, "rooms"), { ...data, createdAt: serverTimestamp() });
      showMessage(roomMessage, "Quarto cadastrado com sucesso.", "success");
    }

    await loadRooms();
    resetRoomForm();
  } catch (error) {
    console.error(error);
    showMessage(roomMessage, humanizeError(error));
  }
}

async function handleAuth(event) {
  event.preventDefault();
  clearMessage(authMessage);
  const formData = new FormData(authForm);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");

  try {
    if (signupMode) {
      if (!ownerBootstrapEmail || email !== ownerBootstrapEmail.toLowerCase()) {
        showMessage(authMessage, "A criação inicial só pode ser feita com o e-mail definido na configuração do Firebase.");
        return;
      }
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", credential.user.uid), {
        role: "owner",
        email,
        createdAt: serverTimestamp(),
      });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    console.error(error);
    showMessage(authMessage, humanizeError(error));
  }
}

async function renderAuthState(user) {
  activeUser = user;
  if (!user) {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
    signOutButton.classList.add("hidden");
    return;
  }

  try {
    if (!await userIsOwner(user)) {
      authSection.classList.remove("hidden");
      dashboard.classList.add("hidden");
      signOutButton.classList.add("hidden");
      showMessage(authMessage, "Esta conta não está autorizada como proprietária do hotel.");
      return;
    }
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    await loadRooms();
  } catch (error) {
    console.error(error);
    showMessage(authMessage, humanizeError(error));
  }
}

function startAdmin() {
  if (!isFirebaseConfigured) {
    setupMessage.classList.remove("hidden");
    setupMessage.textContent = "O painel está pronto, mas precisa da configuração do Firebase para liberar login e cadastro de quartos.";
    authSection.classList.add("hidden");
    return;
  }

  if (!ownerBootstrapEmail) {
    setupMessage.classList.remove("hidden");
    setupMessage.textContent = "Firebase conectado. Falta apenas definir o e-mail do proprietário para liberar o primeiro acesso e o cadastro de quartos.";
    authSection.classList.add("hidden");
    return;
  }

  authForm.addEventListener("submit", handleAuth);
  authToggle.addEventListener("click", () => setSignupMode(!signupMode));
  roomForm.addEventListener("submit", saveRoom);
  cancelEditButton.addEventListener("click", resetRoomForm);
  signOutButton.addEventListener("click", () => signOut(auth));
  onAuthStateChanged(auth, renderAuthState);
}

startAdmin();
