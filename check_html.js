fetch('https://nikole-cristina-advocacia.vercel.app/')
  .then(r => r.text())
  .then(t => {
    console.log(t);
  })
  .catch(console.error);
