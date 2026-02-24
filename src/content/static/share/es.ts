const shareContent: string = `
  <p>
    Si has llegado hasta aquí y tienes algo que decir puedes escribirme por
    <a href="https://x.com/fjpalacios">X</a> o enviarme un
    <a href="mailto:javi@fjp.es">correo electrónico</a>. También puedes compartir esta página
    con tus amigos a través de <a href="https://x.com/intent/tweet?url=%URL%&text=%TITLE%&via=%TWITTER%" target='_blank' rel='noopener noreferrer'>X</a>,
    <a href="https://www.facebook.com/sharer/sharer.php?u=%URL%" target="_blank" rel='noopener noreferrer'>Facebook</a>,
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=%URL%" target="_blank" rel='noopener noreferrer'>LinkedIn</a>,
    <a href="https://api.whatsapp.com/send?text=%TITLE%%20%URL%" target="_blank" rel='noopener noreferrer'>WhatsApp</a>
    o <a href="mailto:?subject=%TITLE%&body=%TITLE%: %URL%">correo electrónico</a>.
  </p>
  `;

export default shareContent;
