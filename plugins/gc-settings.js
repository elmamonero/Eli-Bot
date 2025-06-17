let handler = async (m, { conn, args, usedPrefix, command }) => {
    let isClose = {
        'abrir': 'not_announcement',
        'cerrar': 'announcement',
    }[(args[0] || '').toLowerCase()];

    if (isClose === undefined) {
        return await conn.reply(m.chat, `*🔐 Elige una opción.*\n\n*${usedPrefix + command}* abrir\n*${usedPrefix + command}* cerrar`, m, rcanal);
    }

    // Verificar si el bot tiene permisos de admin en el grupo
    const groupMetadata = await conn.groupMetadata(m.chat);
    const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const botIsAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin);

    if (!botIsAdmin) {
        return await conn.reply(m.chat, "El bot no es administrador en el grupo.", m);
    }

    try {
        await conn.groupSettingUpdate(m.chat, isClose);
        await conn.reply(m.chat, `Se ha actualizado la configuración del grupo a: ${args[0]}`, m);
    } catch (err) {
        console.error('Error al actualizar la configuración del grupo:', err);
        await conn.reply(m.chat, `⚠️ Error al actualizar la configuración del grupo: ${err.message || err}`, m);
    }
}
handler.help = ['group *<abrir/cerrar>*']
handler.tags = ['gc']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler;
