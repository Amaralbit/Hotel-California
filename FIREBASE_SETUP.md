# Configuração do Firebase

O catálogo público, a área do proprietário e o envio de fotos já estão prontos no site. Para conectá-los ao Firebase:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e registre um aplicativo **Web**.
2. Em **Authentication > Sign-in method**, ative **E-mail/senha**.
3. Crie um banco **Cloud Firestore** em modo de produção e ative o **Storage**.
4. Edite `dist/assets/firebase-config.js` com o objeto de configuração do app Web, o e-mail do proprietário e o número de WhatsApp que receberá os pedidos.
5. Em `firestore.rules` e `storage.rules`, substitua `COLOQUE_O_EMAIL_DO_PROPRIETARIO_AQUI` pelo mesmo e-mail do proprietário e publique as regras.
6. Acesse `admin.html`, escolha **Criar a conta do proprietário** e use exatamente o e-mail configurado. Depois disso, essa conta poderá cadastrar quartos, enviar fotos e atualizar os status.

O primeiro usuário administrador é protegido pelas regras: somente o e-mail definido pode receber o papel de proprietário. A configuração Web do Firebase não é um segredo; as regras acima são a camada que protege gravações e uploads.
