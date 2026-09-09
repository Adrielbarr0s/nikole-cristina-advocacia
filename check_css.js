fetch('https://nikole-cristina-advocacia.vercel.app/styles-432XFYB2.css')
  .then(r => console.log('CSS Status:', r.status, r.headers.get('content-type'), 'Length:', r.headers.get('content-length')))
  .catch(console.error);
