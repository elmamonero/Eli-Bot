import fetch from 'node-fetch';

var handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Intentamos obtener la URL de la foto de perfil
  let pp;
  try {
    pp = await conn.profilePictureUrl(who, 'image');
    console.log('URL de la foto de perfil:', pp);
  } catch (e) {
    pp = 'https://files.catbox.moe/r064ge.jpg'; // URL fallback en caso de error
    console.log('Error al obtener foto:', e);
  }

  // Verificamos si la URL es una imagen válida
  try {
    const res = await fetch(pp);
    if (!res.ok || !res.headers.get('content-type')?.startsWith('image/')) {
      // Si la URL no es válida o no es una imagen, usamos la fallback
      pp = 'https://files.catbox.moe/r064ge.jpg';
      console.log('La URL no es válida o no es una imagen, usando fallback');
    }
  } catch (err) {
    // Error al hacer fetch, usamos fallback
    pp = 'https://files.catbox.moe/r064ge.jpg';
    console.log('Error al verificar la URL:', err);
  }

  // Extraemos datos del usuario (esto lo tienes en tu código)
  let { premium, level, description, diamantes, exp, registered, age, role } = global.db.data.users[m.sender];

  age = age || 'Sin especificar';
  description = description || 'Sin descripción';

  let username = conn.getName(who);

  let noprem = `
ˏˋ───･ ｡ﾟ☆: *.☽.* :☆ﾟ｡ ･───ˊˎ
ㅤㅤ *\`𝐏𝐄𝐑𝐅𝐈𝐋 𝐃𝐄𝐋 𝐔𝐒𝐔𝐀𝐑𝐈𝐎\`*

👤 *Nombre:* ${username}
🏷️ *Tag:* @${who.replace(/@.+/, '')}
🍒 *Edad:* ${age}
💌 *Registrado:* ${registered ? '✅': '❌'}
🪪 *Premium:* ${premium ? '✅': '❌'}
📝 *Descripción:* ${description}

╭─• *\`𝐑𝐄𝐂𝐔𝐑𝐒𝐎𝐒\`*
│ *💎 Diamantes* ${diamantes || 0}
│ *🆙 Nivel:* ${level || 0}
│ *💫 Exᴘ* ${exp || 0}
│ *🤍 Rango:* ${role}
╰─────────────•`.trim();

  let prem = `
╭─⪩ 𓆩 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𓆪
│⧼👤⧽ *Usᴜᴀʀɪᴏ:* ${username}
│⧼💌⧽ *Rᴇɢɪsᴛʀᴀᴅᴏ:* ${registered ? '✅': '❌'}
│⧼🔱⧽ *Rᴏʟ:* Vip 👑
╰─────────────⪩

╭─⪩ 𓆩 𝐑𝐄𝐂𝐔𝐑𝐒𝐎𝐒 𓆪
│⧼💎⧽ *:* ${diamantes}
│⧼🆙⧽ *Nɪᴠᴇʟ:* ${level}
│⧼💫⧽ *Exᴘ* ${exp}
│⧼⚜️⧽ *Rᴀɴɢᴏ:* ${role}
╰─────────────⪩`.trim();

  // Enviamos la imagen con la descripción
  await conn.sendFile(m.chat, pp, 'perfil.jpg', `${premium ? prem.trim() : noprem.trim()}`, m, null, { mentions: [who] });
};

handler.help = ['profile'];
handler.register = true;
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
