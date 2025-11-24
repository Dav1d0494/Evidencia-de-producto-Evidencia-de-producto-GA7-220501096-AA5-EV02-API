exports.generateAccessCode = () => {
  const nums = '0123456789';
  const parts = [];
  
  // Generar 3 grupos de 3 dígitos
  for (let i = 0; i < 3; i++) {
    let part = '';
    for (let j = 0; j < 3; j++) {
      part += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    parts.push(part);
  }
  
  // Retornar en formato XXX XXX XXX
  return parts.join(' ');
};
