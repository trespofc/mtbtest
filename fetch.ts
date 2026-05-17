import https from 'https';

https.get('https://metal-blade-int-professional-free-fire-esports-44266003352.asia-southeast1.run.app/assets/index-lVdIEn8O.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Extract strings that look like tailwind classes or text
    const matches = data.match(/(?:className[:=]\s*["']([^"']+)["']|children[:=]\s*["']([^"']+)["'])/g);
    // Let's also extract plain strings from React.createElement or _jsx calls
    const strings = data.match(/"([^"]{10,200})"/g);
    
    console.log("Extracted Strings:");
    if (strings) {
      console.log(strings.slice(0, 50).join('\n'));
    }
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
