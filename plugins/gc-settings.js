let handler = async (m, { conn, args, usedPrefix, command }) => {
    let isClose = {
        'abrir': 'not_announcement',
        'cerrar': 'announcement',
    }[(args[0] || '').toLowerCase()];

    if (isClose === undefined) {
        return await conn.reply(m.chat, `*🔐 Elige una opción.*\n\n*${usedPrefix + command}* abrir\n*${usedPrefix + command}* cerrar`, m, rcanal);
    }

    try {
        console.log('Intentando cambiar configuración:', isClose);
        console.log('ID del grupo:', m.chat);
        await conn.groupSettingUpdate(m.chat, isClose);
        await conn.reply(m.chat, `✅ La configuración del grupo ha sido actualizada a: ${args[0]}`, m);
    } catch (err) {
        console.error('Error en groupSettingUpdate:', err);
        await conn.reply(m.chat, `⚠️ Error al actualizar la configuración del grupo: ${err.message || err}`, m);
    }
};
handler.help = ['group *<abrir/cerrar>*'];
handler.tags = ['gc'];
handler.command = ['group', 'grupo'];
handler.admin = true;
handler.botAdmin = true;

export default handler;
