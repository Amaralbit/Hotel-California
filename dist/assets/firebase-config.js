// Cole aqui a configuração do seu aplicativo Web criada no Firebase Console.
// Os valores desse objeto são públicos por natureza; a proteção real fica nas regras do Firestore e Storage.
export const firebaseConfig = {
  apiKey: "AIzaSyCWGaD4kj7ptWBdxAFqZSUlDz65HOAI-Tw",
  authDomain: "hotel-california-83f9f.firebaseapp.com",
  projectId: "hotel-california-83f9f",
  storageBucket: "hotel-california-83f9f.firebasestorage.app",
  messagingSenderId: "431949916293",
  appId: "1:431949916293:web:fd42246b2ac0fde257e1ec",
};

// Informe o e-mail que será usado para criar a primeira conta do proprietário.
// Depois de criado, esse usuário poderá cadastrar e alterar os quartos no painel.
export const ownerBootstrapEmail = "";

// Número que recebe os pedidos de reserva no WhatsApp, com DDI e DDD, sem símbolos.
export const ownerWhatsAppNumber = "5562994871117";

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
