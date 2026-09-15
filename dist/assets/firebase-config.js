// Cole aqui a configuração do seu aplicativo Web criada no Firebase Console.
// Os valores desse objeto são públicos por natureza; a proteção real fica nas regras do Firestore e Storage.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Informe o e-mail que será usado para criar a primeira conta do proprietário.
// Depois de criado, esse usuário poderá cadastrar e alterar os quartos no painel.
export const ownerBootstrapEmail = "";

// Número que recebe os pedidos de reserva no WhatsApp, com DDI e DDD, sem símbolos.
export const ownerWhatsAppNumber = "5562994871117";

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
