# Configuração do Firebase

O projeto Firebase, o aplicativo Web, Authentication e Firestore já estão conectados ao site. O catálogo público continua disponível com os quartos iniciais até o acesso do proprietário ser concluído.

Pendências para liberar o painel administrativo:

1. Defina o e-mail do proprietário em `dist/assets/firebase-config.js`, no valor de `ownerBootstrapEmail`.
2. Em `firestore.rules`, substitua `COLOQUE_O_EMAIL_DO_PROPRIETARIO_AQUI` pelo mesmo e-mail e publique a regra no Console do Firebase, em **Firestore Database > Rules**.
3. Acesse `admin.html`, escolha **Criar a conta do proprietário** e use exatamente esse e-mail. Depois disso, a conta poderá cadastrar quartos e atualizar os status.

O envio de fotos por arquivo depende do Firebase Storage, que pode ser ativado depois da migração para o plano Blaze. Enquanto isso, o formulário aceita a URL de uma imagem hospedada em outro lugar.

O primeiro usuário administrador é protegido pelas regras: somente o e-mail definido pode receber o papel de proprietário. A configuração Web do Firebase não é segredo; as regras são a camada que protege gravações e uploads.
