const fs = require('fs');
fetch('https://nikole-cristina-advocacia.vercel.app/')
  .then(r => r.text())
  .then(t => {
    const match = t.match(/<link rel="stylesheet" href="(styles-[^\"]+\.css)"/);
    console.log("CSS file on Vercel:", match ? match[1] : 'Not found');
    const jsMatch = t.match(/<script src="(main-[^\"]+\.js)"/);
    console.log("JS file on Vercel:", jsMatch ? jsMatch[1] : 'Not found');
  })
  .catch(console.error);
