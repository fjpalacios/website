const shareContent: string = `
  <p>
    If you have come this far and have something to say you can contact me via
    <a href="https://x.com/fjpalacios">X</a> or send me an
    <a href="mailto:javi@fjp.es">email</a>. You can also share this page with your friends via
    <a href="https://x.com/intent/tweet?url=%URL%&text=%TITLE%&via=%TWITTER%" target='_blank' rel='noopener noreferrer'>X</a>,
    <a href="https://www.facebook.com/sharer/sharer.php?u=%URL%" target="_blank" rel='noopener noreferrer'>Facebook</a>,
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=%URL%" target="_blank" rel='noopener noreferrer'>LinkedIn</a>,
    <a href="https://api.whatsapp.com/send?text=%TITLE%%20%URL%" target="_blank" rel='noopener noreferrer'>WhatsApp</a>
    or <a href="mailto:?subject=%TITLE%&body=%TITLE%: %URL%">email</a>.
  </p>
  `;

export default shareContent;
