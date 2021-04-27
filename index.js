const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const speed = require('performance-now')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const lolis = require('lolis.life')
const loli = new lolis()
const welkom = JSON.parse(fs.readFileSync('./src/json/bemvindo.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const setting = JSON.parse(fs.readFileSync('./src/settings.json'))
const antilink = JSON.parse(fs.readFileSync('./src/json/antilink.json'))
const dominio = JSON.parse(fs.readFileSync('./src/json/antidominio.json'))
const xingamento = JSON.parse(fs.readFileSync('./src/json/antixingamento.json'))
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n'
            + 'FN:Elbielzinho\n'
            + 'ORG:Criador do BOT POSEIDON;\n'
            + 'TEL;type=CELL;type=VOICE;waid=5527999390624:+55 27 99939-0624\n'
            + 'END:VCARD'
prefix = setting.prefix
blocked = []
cr = '*BOT POSEIDON*'

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Hrs ${pad(minutes)} Min ${pad(seconds)} Seg`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
 	})

	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'Conectando...')
	})
	client.on('open', () => {
		success('2', 'Conectado')
	})
	await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Olá @${num.split('@')[0]}\nSeja bem-vindo(a) ao grupo *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Até logo, @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	client.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = setting.apiKey // contact me on whatsapp wa.me/6285892766102
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('America/Sao_Paulo').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			var pes = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
			const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
			const tescuk = ["0@s.whatsapp.net"]

			mess = {
				wait: '⌛ εм pяσcεรรσ ⌛',
				waityt: '⌛ εм pяσcεรรσ ⌛\n\ncσмคหdσร ครร¡м pσdε dεмσяคя мค¡ร dε uм м¡หuтσ pคяค รεя ƒ¡หคł¡zคdσ, cครσ pครรคя мค¡ร dε тяεร м¡หuтσร ε ค¡หdค หคσ ƒσ¡ ƒ¡หคł¡zคdσ uรε uмค тคg мค¡ร εรpεc¡ƒ¡cค..',
				waitfig: '⌛ εм pяσcεรรσ ⌛\n\n¡รรσ pσdε łεvคя หσ мคx¡мσ dσ¡ร м¡หuтσร, หคσ uรε тεxтσ pคяค cя¡คя εรรε т¡pσ dε ƒ¡guя¡หнค ε หคσ cя¡ε ƒ¡guя¡หнค คтσค.',
				success: '✔️ รucεรรσ ✔️',
				error: {
					stick: '❌ ƒคłнค, σcσяяεu uм εяяσ คσ cσหvεятεя ค ¡мคgεм εм uм คdεร¡vσ. ❌',
					Iv: '❌ ł¡หк ¡หvคł¡dσ ❌'
				},
				only: {
					group: '❌ εรтε cσмคหdσ รσ pσdε รεя uรคdσ εм gяupσร! ❌',
					ownerG: ' εรтε cσмคหdσ รσ pσdε รεя uรคdσ εм gяupσร! ❌',
					ownerB: '❌ εรтε cσмคหdσ รσ pσdε รεя uรคdσ pεłσ pяσpя¡εтคя¡σ dσ Ъσт! ❌',
					admin: 'εรтε cσмคหdσ รσ pσdε รεя uรคdσ pσя คdм¡ห¡รтяคdσяεร dσ gяupo!',
					Badmin: 'εรтε cσмคหdσ รσ pσdε รεя uรคdσ quคหdσ σ Ъσт ε uм คdм¡ห¡รтяคdσя!'
				}
			}

			const apakah = ['Sim','Não','Talvez','Talvez sim','Talvez não','Tente perguntar novamente','Nem pensar','Tente perguntar novamente']
			const amor = ['O amor está tão perto de você que é quase impossível de ver.','O amor é cego.','Se você realmente ama a pessoa, esqueça das coisas que os outros fala e ouve o que o seu coração está falando.','O segredo é o amor, carinho, confiança e o mais importante a presença.','Nunca deixa de sonhar, um dia vocês estarão juntos.','O amor é uma coisa especial, poucas pessoas tem e muitas querem.','Não dê ouvidos para as pessoas que só querem lhe derrubar se elas querem te derrubar certamente querem você longe da pessoa amada','Bate para lá, bate para cá._\n_É o meu amor que não para de cantar.','O meu amor é a Nicolle e quem é o seu?','Ninguém pode servir a dois amores, porque ou odiará a um e amará o outro, ou dedicar-se-á a um e desprezará o outro. Não podeis servir a duas mulheres ao mesmo tempo.','Toda vez que eu penso em você, eu juro, eu me apaixono novamente.','Mesmo que eu não fique com você e mesmo que você conheça outra pessoa, sempre quando me perguntarem se eu amei alguém eu lembrarei de você...','Se caso isso não durar para a eternidade, saiba, que você é, e sempre será, o meu felizes para sempre.','Jamais desistirei de você, pós assim como o Sol e a Lua teremos nosso eclipse, e espero que até lá, Saturno guarde nossos anéis.','Talvez em outra vida eu seja sua garota preferida...','Se eu nao for o grande amor da sua vida, que eu seja uma grande lembrança..','A vida é muito curta para te amar só em uma, prometo te procurar na próxima','Eu sei que a gente está longe agora, mas sempre que você sentir minha falta, olhe para a lua, eu vou ter falado de ti pra ela e também estarei olhando....','Se o tempo parasse cada vez que eu penso em você, ainda estaríamos no dia em q eu te conheci','Se o sol pudesse me ouvir, ele ficaria chocado, por saber que meu amor por você, superou o dele com a lua','Se a gente não der certo lembre-se, as vezes almas gêmeas estão destinadas a se encontrar não a ficarem juntas','Mesmo que a gente não der certo, você sempre será minha referência de amor','Se a Lua realmente me escuta toda noite, ela deve estar apaixonada por ti também...']
			const cassino = ['ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 1 ─═─ 2 ─═─ 3*\n*║*\n*║*\n*╠* Não foi dessa vez mas\n*║* continue tentando.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 2 ─═─ 3 ─═─ 1*\n*║*\n*║*\n*╠* Não foi dessa vez mas\n*║* continue tentando.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 3 ─═─ 2 ─═─ 1*\n*║*\n*║*\n*╠* Não foi dessa vez mas\n*║* continue tentando.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 1 ─═─ 3 ─═─ 2*\n*║*\n*║*\n*╠* Não foi dessa vez mas\n*║* continue tentando.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 2 ─═─ 1 ─═─ 3*\n*║*\n*║*\n*╠* Não foi dessa vez mas\n*║* continue tentando.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 3 ─═─ 1 ─═─ 2*\n*║*\n*║*\n*╠* Não foi dessa vez mas\n*║* continue tentando.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 1 ─═─ 1 ─═─ 1*\n*║*\n*║*\n*╠* PARABÉNS !!!\n*╠* VOCÊ GANHOU NO CASSINO.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 2 ─═─ 2 ─═─ 2*\n*║*\n*║*\n*╠* PARABÉNS !!!\n*╠* VOCÊ GANHOU NO CASSINO.\n*║*\n*╚═─ CASSINO ─══*','ㅤ\n*╔═─ CASSINO ─══*\n*║*\n*║*\n*╠* ROLETA DOS TRÊS\n*╠* NÚMEROS\n*║*\n*╠═─ 3 ─═─ 3 ─═─ 3*\n*║*\n*║*\n*╠* PARABÉNS !!!\n*╠* VOCÊ GANHOU NO CASSINO.\n*║*\n*╚═─ CASSINO ─══*']
			const porcentagem = ['0%','1%','2%','3%','4%','5%','6%','7%','8%','9%','10%','11%','12%','13%','14%','15%','16%','17%','18%','19%','20%','21%','22%','23%','24%','25%','26%','27%','28%','29%','30%','31%','32%','33%','34%','35%','36%','37%','38%','39%','40%','41%','42%','43%','44%','45%','46%','47%','48%','49%','50%','51%','52%','53%','54%','55%','56%','57%','58%','59%','60%','61%','62%','63%','64%','65%','66%','67%','68%','69%','70%','71%','72%','73%','74%','75%','76%','77%','78%','79%','80%','81%','82%','83%','84%','85%','86%','87%','88%','89%','90%','91%','92%','93%','94%','95%','96%','97%','98%','99%','100%','muito que nem conseguimos falar','muito pouco e muito menor que 0%']
			const cantadas = ['Eu: »Você tem um mapa?«_\n_Ela: »Não, por quê?«_\n_Eu: »Porque me perdi no brilho dos seus olhos.«','Eu: Havia dois ursos o Beijaeu e o Mebeija e então o Beijaeu morreu. Quem sobrou?','Não sou carro, mas sou Para ti.','Eu não sou a Casas Bahia, mas prometo dedicação total a você.','Eu: »Seu nome é Tamara né?«_\n_Ela: »Não, por quê?«_\n_Eu: »Por que você TAMARAvilhosa!«','Estou fazendo uma campanha de doação de órgãos! Então, não quer doar seu coração pra mim?','Você não é pescoço mais mexeu com a minha cabeça!','Se você fosse um sanduíche teu nome seria X-Princesa.','Eu perdi o número do meu telefone… Me empresta o seu?','Você não usa calcinha, você usa porta-jóias.','Gata, me chama de capeta e deixa te possuir','Você é o ovo que faltava na minha marmita.','Gata, papo de urubu, pena de galinha, se você quer um beijinho dê uma risadinha.','Gata, casando comigo você nunca vai pegar na enxada! Só vai ter que fazer amor desde a manhã até a madrugada!','Gata, me chama de tabela periódica e diz que rola uma química entre nós.','Gata, se beleza brotasse em ovos você seria dona da granja inteira!','Gata, você é sempre gostosa assim ou hoje tá fantasiada de lasanha?','Gata, você é tão desejada quanto uma sexta-feira.','Gata, você foi feita com velas, mel, fitinhas vermelhas e rosas? Porque te achei uma simpatia.','Gata, você não é a Garota de Ipanema, mas é a coisa mais linda e cheia de graça que já vi.','Em cima da colina passa boi passa boiada, só saio da sua frente quando for minha namorada.','Gata, que roupa feia, Tira isso agora!','Gata, eu não sou o Luciano Huck, Mas eu quero você no meu lar doce lar! Sua linda!','Gata, você é uma paçoca?_\n_Porque só de sentir o cheiro já dá vontade de comer, sua linda!','Gata, eu rezo 1/3, para achar 1/2 De te levar pra 1/4, sua linda!','Gata, você não é piso molhado Mas eu já tô pronto, pra te passar o rodo, sua linda!','Gata seu pai é dono da Tam?. Não, por que? Então como é que faz pra ter um avião desse em casa?','Gata, você é o doce de leite Que falta no meu churros.','Gata, você tem brigadeiro?. Não Então me dá um beijinho.','Gata, entre Star Wars e Star trek, O que eu queria mesmo era star com você.','Gata, eu não sou plano de saúde, Mas se você quiser eu acabo com a sua carência.','Gata, você deve comer photoshop no café da manhã! Pra ser tão linda assim!','Gata, eu não sou manteiga de cacau, Mas adoraria amaciar seus lábios.','Gata, seu nome é Camila?. Sim, por que? Então vem »camilamber«!','Desculpe, eu não já fiquei com você antes? Não Vamos dar um jeito nisso.','Meu nome e Arnaldo mais pode me chamar de Naldo, pois quando eu te vi perdi o ar.','Seu pai é mecânico? Porque você é uma graxinha!','Gata, a economia grega anda tão ruim assim? Por quê?_\n_Porque até uma deusa grega como você veio morar aqui!','Nossa, você é tão linda que não caga, lança bombom!','Você acredita em amor à primeira vista ou devo passar por aqui mais uma vez?','Se felicidade fosse dinheiro, você seria o Banco Central e eu seria o maior investidor.','Gata, vamos viajar o mundo usando meus créditos de desconto no Airbnb?','Me chama de previsão do tempo e diz que tá rolando um clima.','Você diz: »Sabe qual a diferença entre você e um milhão de reais?«_\n_Ela responde, »Não, qual?«_\n_Você diz: »É que um milhão de reais eu tenho na minha casa.«','Você diz: »Você gosta de Toddy?«_\n_Ela responde, »Sim, por que?«_\n_Você diz: »Se você quiser eu posso ser Toddynho seu.«','Você diz: »Gata, me pega no colo?«\n_Ela responde: »Não, por quê?«_\n_Você diz: »É que minha mãe vem vindo e eu queria contar que andei de avião«','Me passa o seu Twitter? O meu pai disse que eu devo seguir o meu sonho.','Não sou traficante, mas eu quero a sua boca.','Faça uma pose de príncipe declamando um poema e diga: »Pulei na água até o umbigo, então, quer ficar comigo?«','Gata, você é tão gata que se eu te matar de amor ainda sobram mais 6 vidas.']
			const botNumber = client.user.jid
 			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isAntiLink = isGroup ? antilink.includes(from) : false
			const isDominio = isGroup ? dominio.includes(from) : false
			const isXingamento = isGroup ? xingamento.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			const costum = (pesan, tipe, target, target2) => {
			        client.sendMessage(from, pesan, tipe, {quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target2}` }}})
			}

			if (
			messagesC.includes("://chat.whatsapp.com/") ||
			messagesC.includes("twittet.com") ||
			messagesC.includes("youtube.com") ||
			messagesC.includes("youtu.com") ||
			messagesC.includes("youtu.be")
			){
			if (!isGroup) return
			if (!isAntiLink) return
			if (isGroupAdmins) return reply('Digo nada, né admin?')
			client.updatePresence(from, Presence.composing)
			if (messagesC.includes("#izinadmin")) return reply("#izinadmin diterima")
			var kic = `${sender.split("@")[0]}@s.whatsapp.net`
			reply(`Olá ${sender.split("@")[0]} nós não aceitamos esse tipo de link nesse grupo`)
			setTimeout( () => {
				client.groupRemove(from, [kic]).catch((e)=>{reply(`*ERR:* ${e}`)})
			}, 2000)
		}

			if (messagesC.includes("bot")){
		client.updatePresence(from, Presence.composing)
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		await costum('Olá, o BOT POSEIDON está online, caso deseja ver a tabela de comandos é só me enviat o comando */menu*, obrigado por utilizar BOT POSEIDON.', text, tescuk, cr)

	}

		if (
		messagesC.includes(".com") || 
		messagesC.includes(".net") ||
		messagesC.includes(".tk") ||
		messagesC.includes("blazebr.xyz") ||
		messagesC.includes("https://") ||
		messagesC.includes("http://") ||
		messagesC.includes("8080") ||
		messagesC.includes(".xyz") ||
		messagesC.includes(".vk") ||
		messagesC.includes(".br") ||
		messagesC.includes(".ddns.xyz") ||
		messagesC.includes(".ddns.net") ||
		messagesC.includes(".ddns.tk") ||
		messagesC.includes(".gg") ||
		messagesC.includes("ultrahostbr.com")
		){
		if (!isGroup) return
		if (!isDominio) return
		if (isGroupAdmins) return reply('Digo nada, né admin?')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#izinadmin")) return reply("#izinadmin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`Não é permitido divulgação de domínios/IP nesse grupo. `)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`*ERR:* ${e}`)})
		}, 2000)
	}

	if (
		messagesC.includes("preto") || 
		messagesC.includes("fdp") ||
		messagesC.includes("fds") ||
		messagesC.includes("vtmc") ||
		messagesC.includes("baleia") ||
		messagesC.includes("gozei") ||
		messagesC.includes("cú") ||
		messagesC.includes("nazista") ||
		messagesC.includes("lixo") ||
		messagesC.includes("lx") ||
		messagesC.includes("bosta") ||
		messagesC.includes("merda") ||
		messagesC.includes("otario") ||
		messagesC.includes("puta")
		){
		if (!isGroup) return
		if (!isXingamento) return
		if (isGroupAdmins) return reply('Digo nada, né admin?')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#izinadmin")) return reply("#izinadmin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`Não é permitido racismo nesse grupo. `)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`*ERR:* ${e}`)})
		}, 2000)
	}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCMD\x1b[1;37m]', time, color(sender.split('@')[0]), 'utilizou o comando', color(command), 'em seu privado')
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(sender.split('@')[0]), 'lhe enviou uma', color("mensagem"), 'em seu privado')
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCMD\x1b[1;37m]', time, color(sender.split('@')[0]), 'utilizou o comando', color(command), 'no grupo', color(groupName))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(sender.split('@')[0]), 'enviou uma', color("mensagem"), 'no grupo', color(groupName))
			let authorname = client.contacts[from] != undefined ? client.contacts[from].vname || client.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }

			function addMetadata(packname, author) {
				if (!packname) packname = 'WABot'; if (!author) author = 'Bot';
				author = author.replace(/[^a-zA-Z0-9]/g, '');
				let name = `${author}_${packname}`
				if (fs.existsSync(`./src/stickers/${name}.exif`)) return `./src/stickers/${name}.exif`
				const json = {
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]

				let len = JSON.stringify(json).length
				let last

				if (len > 256) {
					len = len - 256
					bytes.unshift(0x01)
				} else {
					bytes.unshift(0x00)
					}

				if (len < 16) {
					last = len.toString(16)
					last = "0" + len
				} else {
					last = len.toString(16)
				}

				const buf2 = Buffer.from(last, "hex")
				const buf3 = Buffer.from(bytes)
				const buf4 = Buffer.from(JSON.stringify(json))

				const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])

				fs.writeFile(`./src/stickers/${name}.exif`, buffer, (err) => {
					return `./src/stickers/${name}.exif`
				})

			}
			switch(command) {
				case 'help':
				case 'menu':
					await costum(help(prefix), text, tescuk, cr)
					break
				case 'sttc':
			     	if (args.length < 1) return reply(`_Coloque o texto_\n\n*Exemplo ${prefix}sttc Elbielzinho*`)
                                reply(mess.waitfig)
				url = encodeURI(`https://api.xteam.xyz/attp?file&text=${body.slice(6)}`)
		    		attp2 = await getBuffer(url)
				client.sendMessage(from, attp2, sticker, {quoted: mek})
					break
				case 'ping':
					const timestamp = speed();
                                        const latensi = speed() - timestamp
                                        client.updatePresence(from, Presence.composing) 
				        uptime = process.uptime()
				options = {
					text: `ㅤ\n*╔═─ PING ─══*\n*║*\n*╠* _Pedido de ↓_ \n*╠* @${sender.split("@s.whatsapp.net")[0]}\n*║*\n*╠* Criador: *Elbielzinho*\n*╠* WhatsApp: *+5527999390624*\n*╠* Ping: *${latensi.toFixed(4)} _Segundos_*\n*╠* Celular: *Galaxy Pocket Lite*\n*╠*	RAM: *200Mb*\n*╠* Rede: *3G*\n*║*\n*╠* Online desde:\n*╠ ${kyun(uptime)}*\n*║*\n*╚═─ PING ─══*`,
					contextInfo: { mentionedJid: [sender] }
					}
					await costum(options, text, tescuk, cr)
				break
				case 'blocklist':
					teks = 'Numero bloqueados :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Como vou ler a imagem sem você ter marcado ela?')
					}
					break
				case 'tp':
					if (args.length < 1) {
						return reply('Escolhe um tema entre 1 à 162.')
					} else if (args[0].toLowerCase() === 'list') {
						teks = await fetchText('https://mhankbarbar.moe/api/textpro/listtheme')
						teks = teks.replace(/<br>/g, '\n')
						return reply(teks)
					} else if (args.length < 2) {
						return reply('Coloque a frase.')
					}
					reply(mess.wait)
					anu = `https://mhankbarbar.moe/api/textpro?pack=${args[0]}&text=${body.slice(3+args[0].length+1)}&apiKey=${apiKey}`
					voss = await fetch(anu)
					ftype = require('file-type')
					vuss = await ftype.fromStream(voss.body)
					if (vuss !== undefined) {
						client.sendMessage(from, await getBuffer(anu), image, { caption: mess.success, quoted: mek })
					} else {
						reply('Escolhe outro tema por causa que esse deu poblema.')
					}
					break
				case 'ep':
					if (args.length < 1) {
						return reply('Escolhe um tema de 1 à 216')
					} else if (args[0].toLowerCase() === 'list') {
						teks = await fetchText('https://mhankbarbar.moe/api/ephoto/listtheme')
						teks = teks.replace(/<br>/g, '\n')
						return reply(teks)
					} else if (args.length < 2) {
						return reply('Coloque a frase.')
					}
					reply(mess.wait)
					anu = `https://mhankbarbar.moe/api/ephoto?pack=${args[0]}&text=${body.slice(3+args[0].length+1)}&apiKey=${apiKey}`
					voss = await fetch(anu)
					ftype = require('file-type')
					vuss = await ftype.fromStream(voss.body)
					//console.log(vuss)
					if (vuss !== undefined) {
						client.sendMessage(from, await getBuffer(anu), image, { caption: mess.success, quoted: mek })
					} else {
						reply('Esse tema deu erro, tente outro.')
					}
					break
				case 'tahta':
					if (args.length < 1) return reply('Teksnya om')
					anu = `https://mhankbarbar.moe/api/htahta?text=${args.join(' ')}&apiKey=${apiKey}`
					voss = await fetch(anu)
					ftype = require('file-type')
					vuss = await ftype.fromStream(voss.body)
					if (vuss !== undefined) {
						client.sendMessage(from, await getBuffer(anu), image, { quoted: mek, caption: mess.sucess })
					} else {
						reply('Terjadi kesalahan')
					}
					break
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)	
								})
								/*client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Falha, no momento da conversão ${tipe} para o adesivo`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)
									fs.unlinkSync(ran)
								})
								/*client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Falha, ocorreu um erro, tente novamente mais tarde.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ranw} -o ${ranw}`, async (error) => {
									if (error) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
									fs.unlinkSync(ranw)
								})
								//client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Envie fotos com legendas ${prefix}sticker ou tags de imagem que já foram enviadas`)
					}
					break
				case 'gtts':
					if (args.length < 1) return client.sendMessage(from, '_Coloque um idioma_\n\n*Exemplo:* ${prefix}gtts IDIOMA texto', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, '_Cadê o texto?_\n\n*Exemplo:* ${prefix}gtts idioma TEXTO', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					dtt.length > 600
					? reply('_Tem mais de 600 caracteres de  texto_\n\n*Exemplo:* ${prefix}gtts idioma TEXTO')
					: gtts.save(ranm, dtt, function() {
						client.sendMessage(from, fs.readFileSync(ranm), audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
						fs.unlinkSync(ranm)
					})
					break
				case 'meme12':
					meme = await fetchJson('https://kagchi-api.glitch.me/meme/memes', { method: 'get' })
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				/*case 'memeindo12':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break*/
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					setting.prefix = prefix
					fs.writeFileSync('./src/settings.json', JSON.stringify(setting, null, '\t'))
					reply(`Prefix alterado com sucesso para ${prefix}`)
					break
				/*case 'loli12':
					loli.getSFWLoli(async (err, res) => {
						if (err) return reply('❌ *ERROR* ❌')
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Ingat! Citai Lolimu'})
					})
					break
				case 'nsfwloli12':
					if (!isNsfw) return reply('❌ *FALSE* ❌')
					loli.getNSFWLoli(async (err, res) => {
						if (err) return reply('❌ *ERROR* ❌')
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					})
					break
				case 'hilih12':
					if (args.length < 1) return reply('Teksnya mana um?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break*/
				case 'yt2mp3':
					if (args.length < 1) return reply('Urlnya mana um?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbar.moe/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'ytsearch':
					if (args.length < 1) return reply('Yang mau di cari apaan? titit?')
					anu = await fetchJson(`https://mhankbarbar.moe/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'tiktok':
					if (args.length < 1) return reply('Urlnya mana um?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.moe/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, 'Usernamenya mana um?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('Kemungkinan username tidak valid')
					}
					break
				case 'nulis12':
				case 'tulis12':
					if (args.length < 1) return reply('Yang mau di tulis apaan?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.moe/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case 'url2img':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Tipenya apa um?')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Urlnya mana um?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.moe/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Textnya mana um?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbar.moe/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${rano} -o ${rano}`, async (error) => {
							if (error) return reply(mess.error.stick)
							client.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: mek})
							fs.unlinkSync(rano)
						})
						/*client.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: mek})
						fs.unlinkSync(rano)*/
					})
					break
				case 'lista':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += `  Total : ${groupMembers.length}\n`
					for (let mem of groupMembers) {
						teks += `╠➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions('╔══✪〘 AVISO 〙✪══\n╠➥'+teks+'╚═〘 - - - - 〙', members_id, true)
					break
                                case 'lista2':
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `# @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                                case 'lista3':
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `➥ https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					client.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					break
				case 'bc':
					if (!isOwner) return reply('Apenas o meu dono pode fazer isso, você não é o Elbielzinho.')
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `[ Ini Broadcast ]\n\n${body.slice(4)}`})
						}
						reply('SUCESSO')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ AVISO ]\n\n${body.slice(4)}`)
						}
						reply('SUCESSO')
					}
					break
                                case 'op':
					if (!isGroup) return reply(mess.only.group)
					if (isGroupAdmins || isOwner) {
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Promovido com sucesso\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(` @${mentioned[0].split('@')[0]} virou admin do grupo!`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}}
					break
				case 'deop':
					if (!isGroup) return reply(mess.only.group)
					if (isGroupAdmins || isOwner) {
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Rebaixado com sucesso\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(` @${mentioned[0].split('@')[0]} saiu de admin para membro!`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (isGroupAdmins || isOwner) {
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Cadê o numero?')
					if (args[0].startsWith('08')) return reply('Sla..')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Numero privado')
					}}
					break
				case 'ban':
					if (!isGroup) return reply(mess.only.group)
					if (isGroupAdmins || isOwner) {
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Marque o *@* de um membro para banir.!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Até logo, ksks. :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Até logo @${mentioned[0].split('@')[0]} espero que volte um dia.`, mentioned, true)
						client.groupRemove(from, mentioned)
					}}
					break
				case 'ajuda':
					if (!isGroup) return reply(mess.only.group)
					teks = `Lista de ajudantes do *${groupMetadata.subject}*\nTotal: ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'link':
					if (!isGroup) return reply(mess.only.group)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					linkgc = await client.groupInviteCode(from)
					reply('https://chat.whatsapp.com/'+linkgc)
					break
				case 'leave':
					if (!isGroup) return reply(mess.only.group)
					if (isGroupAdmins || isOwner) {
					client.groupLeave(from)
					} else {
					reply(mess.only.admin)
					}
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('❌ reply stickernya um ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ ERRO AO LER O STICKER ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
				case 'simi':
					if (args.length < 1) return reply('Onde está o texto, hum?')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('O modo Simi está ativo')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Ativado com sucesso o modo simi neste grupo 😗️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Desativado modo simi com sucesso neste grupo 😡️')
					} else {
						reply('1 para ativar, 0 para desativar, lerdao vc em KKKKK')
					}
					break
				case 'bemvindo':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Udah aktif um')
						welkom.push(from)
						fs.writeFileSync('./src/json/bemvindo.json', JSON.stringify(welkom))
						reply('ATIVADO COM SUCESSO ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/json/bemvindo.json', JSON.stringify(welkom))
						reply('ATIVADO COM SUCESSO_2 ✔️')
					} else {
						reply('1 para ativar e 0 para desativar.')
					}
					break
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag target yang ingin di clone')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Clonado o perfil do  @${id.split('@')[0]} com SUCESSO`, [jid], true)
					} catch (e) {
						reply('ERROR')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Mostre-me a foto.')
					}
					break
				case 'play':
					if (args.length < 1) return reply('Onde está o titulo??')
					play = body.slice(5)
					reply(mess.waityt)
					anu = await fetchJson(`https://api.zeks.xyz/api/ytplaymp3?q=${play}&apikey=apivinz`)
					if (anu.error) return reply(anu.error)
					infomp3 = `*Canção encontrada!!!*\nTítulo : ${anu.result.title}\nFonte : ${anu.result.source}\nTamanho : ${anu.result.size}\n\n*ESPERE O AUDIO ESTÁ SENDO CARREGADO.*`
					buffer = await getBuffer(anu.result.thumbnail)
					lagu = await getBuffer(anu.result.url_audio)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: infomp3})
					client.sendMessage(from, lagu, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'owner':
				case 'creator':
				case 'criador':
				case 'dono':
					await costum('Este é meu número do meu proprietário, salve-o e irei salvá-lo mais tarde', text, tescuk, cr)
					await costum({displayname: "Jeff", vcard: vcard}, MessageType.contact, cr)
					break
				case 'perguntar':
					if (args.length < 1) return reply('Onde está a pergunta??')
					client.updatePresence(from, Presence.composing)
					random = apakah[Math.floor(Math.random() * (apakah.length))]
					hasil = `*Resposta:* _${random}_`
					reply(hasil)
					break
				case 'amor':
					random = amor[Math.floor(Math.random() * (amor.length))]
					await costum(`_${random}_`, text, tescuk, cr)
					break
				case 'wa.me':
				case 'wame':
  client.updatePresence(from, Presence.composing) 
      options = {
          text: `ㅤ\n*╔═─ WHATSAPP ─═╼*\n*║*\n*╠* _Pedido de ↓_\n*╠* @${sender.split("@s.whatsapp.net")[0]}\n*║*\n*╠* Seu link de WhatsApp é\n*║*\n*╠ wa.me/${sender.split("@s.whatsapp.net")[0]}*\n*║*\n*╚═─ WA.ME ─═╼*`,
          contextInfo: { mentionedJid: [sender] }
    }
    await costum(options, text,tescuk, cr)
					break
				case 'delete':
				case 'del':
					if (!isGroup)return reply(mess.only.group)
					if (!isGroupAdmins)return reply(mess.only.admin)
					client.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
					break
				case 'delt':
                        		if (!isGroup)return reply(mess.only.group)
                        		if (!isOwner)return reply(mess.only.ownerB)
					client.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
                                        break
			case 'antilinkgroup':
			case 'antilinkgrup':
			case 'antilinkgc':
			case 'antilink':
                                	if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Digite 1 para ativar')
					if (Number(args[0]) === 1) {
						if (isAntiLink) return reply('Já está ativado.')
						antilink.push(from)
						fs.writeFileSync('./src/json/antilink.json', JSON.stringify(antilink))
						reply('Sistema de anti-link ativado cim sucesso.✔️')
						client.sendMessage(from,`Quem mandar link de grupo do WhatsApp vai ser removido automaticamente.`, text)
					} else if (Number(args[0]) === 0) {
						if (!isantilink) return reply('Sistema desligado.')
						var ini = anti.indexOf(from)
						antilink.splice(ini, 1)
						fs.writeFileSync('./src/json/antilink.json', JSON.stringify(antilink))
						reply('Sistema desligado com sucesso ✔️')
					} else {
						reply('1 para ligar e 0 para desligar.')
					}
					break
				case 'antidominio':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
					if (isDominio) return reply('O sistema já está ativado')
						dominio.push(from)
						fs.writeFileSync('./src/json/antidominio.json', JSON.stringify(dominio))
						reply('ATIVADO COM SUCESSO ✔️')
					} else if (Number(args[0]) === 0) {
						dominio.splice(from, 1)
						fs.writeFileSync('./src/json/antidominio.json', JSON.stringify(dominio))
						reply('DESLIGADO COM SUCESSO ✔️')
					} else {
						reply('1 para ativar e 0 para desativar.')
					}
                                      break
				case 'antixingamento':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
					if (isXingamento) return reply('O sistema já está ativado')
						xingamento.push(from)
						fs.writeFileSync('./src/json/antixingamento.json', JSON.stringify(xingamento))
						reply('ATIVADO COM SUCESSO ✔️')
					} else if (Number(args[0]) === 0) {
						xingamento.splice(from, 1)
						fs.writeFileSync('./src/json/antixingamento.json', JSON.stringify(xingamento))
						reply('DESLIGADO COM SUCESSO ✔️')
					} else {
						reply('1 para ativar e 0 para desativar.')
					}
                                      break
				case 'qrcode':

                buff = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?data=${body.slice(8)}&size=1080%C3%971080`)
				client.sendMessage(from, buff, image, {quoted: mek})
				break
				case 'gay':

               random = porcentagem[Math.floor(Math.random() * (porcentagem.length))]
		   hasil = `Percentagem Gay de ${random}.`
		   reply(hasil)
					break
					case 'corno':

               random = porcentagem[Math.floor(Math.random() * (porcentagem.length))]
		   hasil = `Percentagem Corno de ${random}.`
		   reply(hasil)
					break
					case 'meme':
					reply(mess.wait)
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=MEME BRASIL`, {method: 'get'})
					ri = JSON.parse(JSON.stringify(anu));
					ze =  ri[Math.floor(Math.random() * ri.length)];
					nye = await getBuffer(ze)
					client.sendMessage(from, nye, image, { caption: 'Ai que cringe.️', quoted: mek })
					break
                   case 'casal':
					if (!isGroup) return reply(mess.only.group)
						membr = []
						const suamae11 = groupMembers
						const suamae21 = groupMembers
						const teupai11 = suamae11[Math.floor(Math.random() * suamae11.length)]
						const teupai21 = suamae21[Math.floor(Math.random() * suamae21.length)]
						var shipted1 = ["1%", `10%`, `20%`, `40%`, `50%`, `60%`, `80%`, `90%`, `100%`, `99999%`]
						const shipted = shipted1[Math.floor(Math.random() * shipted1.length)]
						teks = `*Hmmm.... Shippo os dois 💟💟*\n\n1= @${teupai11.jid.split('@')[0]}\ne esse\n2= @${teupai21.jid.split('@')[0]}\ncom uma porcentagem de: ${shipted}`
						membr.push(teupai11.jid)
						membr.push(teupai21.jid)
						mentions(teks, membr, true)
					break
				case 'rankcorno':
                                        if (!isGroup) return reply(mess.only.group)
                                membr = []
                                const corno1 = groupMembers
                                const corno2 = groupMembers
				const corno3 = groupMembers
				const corno4 = groupMembers
				const corno5 = groupMembers
                                const gado1 = corno1[Math.floor(Math.random() * corno1.length)]
                                const gado2 = corno2[Math.floor(Math.random() * corno2.length)]
				const gado3 = corno3[Math.floor(Math.random() * corno3.length)]
				const gado4 = corno4[Math.floor(Math.random() * corno4.length)]
				const gado5 = corno5[Math.floor(Math.random() * corno5.length)]

       			teks = `Hmmm.... Rank Corno(a) está pronto 🐂🐄*\n\n*1° =* @${gado1.jid.split('@')[0]}\n*2° =* @${gado2.jid.split('@')[0]}\n*3° =* @${gado3.jid.split('@')[0]}\n*4° =* @${gado4.jid.split('@')[0]}\n*5° =* @${gado5.jid.split('@')[0]}`
                                membr.push(gado1.jid)
                                membr.push(gado2.jid)
				membr.push(gado3.jid)
				membr.push(gado4.jid)
				membr.push(gado5.jid)
                                mentions(teks, membr, true)
                                        break
				case 'ranklgbt':
                                        if (!isGroup) return reply(mess.only.group)
                                membr = []
					const gay1 = groupMembers
					const gay2 = groupMembers
					const gay3 = groupMembers
					const gay4 = groupMembers
					const gay5 = groupMembers
					const lgbt1 = gay1[Math.floor(Math.random() * gay1.length)]
					const lgbt2 = gay2[Math.floor(Math.random() * gay2.length)]
					const lgbt3 = gay3[Math.floor(Math.random() * gay3.length)]
					const lgbt4 = gay4[Math.floor(Math.random() * gay4.length)]
					const lgbt5 = gay5[Math.floor(Math.random() * gay5.length)]

        teks = `*💁🏻‍♀️Hmmm.... Rank 🏳️‍🌈LGBT🏳️‍🌈 está pronto 🥰*\n\n*1° »* @${lgbt1.jid.split('@')[0]}\n*2° »* @${lgbt2.jid.split('@')[0]}\n*3° »* @${lgbt3.jid.split('@')[0]}\n*4° »* @${lgbt4.jid.split('@')[0]}\n*5° »* @${lgbt5.jid.split('@')[0]}`
					membr.push(lgbt1.jid)
					membr.push(lgbt2.jid)
					membr.push(lgbt3.jid)
					membr.push(lgbt4.jid)
					membr.push(lgbt5.jid)
                                mentions(teks, membr, true)
                                        break
					case 'block':
					client.updatePresence(from, Presence.composing)
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.blockUser (`${body.slice(8)}@c.us`, "add")
					client.sendMessage(from, `Agora você não vai utilizar comandos, entendeu ${body.slice(8)}@c.us ?`, text)
					break
				case 'cantadas':
					client.updatePresence(from, Presence.composing)
					random = cantadas[Math.floor(Math.random() * (cantadas.length))]
					hasil = `_${random}_`
					await costum(hasil, text, tescuk, cr)
					break
				case 'cassino':

               random = cassino[Math.floor(Math.random() * (cassino.length))]

			  await costum(`${random}`, text, tescuk, cr)

					break
				case 'porcentagem':

               random = porcentagem[Math.floor(Math.random() * (porcentagem.length))]

			   reply(`Certamente é *${random}*`)

					break
				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(body)
						muehe = await simih(budy)
						console.log(budy)
						reply(muehe)
					} else {
						//return console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0])) || reply('teste - bot')
					}	}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
