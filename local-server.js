const htmlFiles = [
	'header',
	'main',
	'quiz',
	'places',
	'loading',
	'footer',
];

let workDir = '/src/';
if (process.env.DIST_FOLDER) workDir = `/${process.env.DIST_FOLDER}/`;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

if ( ! process.env.IP || ! process.env.PORT) {
	console.error('Need to specify IP and PORT environments (example: IP=192.168.23.42 PORT=80 node local-server.js) !');
	process.exit();
}
server.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running at http://${server.address().address}:${server.address().port}?vk_access_token_settings=friends&vk_app_id=7535937&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=1&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=16488084&sign=zc2BlooqjEK2qOkIglEH6vKGlwxGsfVUfIlj8ajD-OM from ${workDir}`);
});

app.use(express.static(__dirname + workDir));

if (workDir === '/src/') {
	const fs = require('fs');
	const path = require('path');

	const templateJs = (file) => { return `<script defer src="${file}"></script>`; };
	const templateCss = (file) => { return `<link rel="stylesheet" href="${file}">`; };

	let pathJsFiles = ``;
	let pathCssFiles = ``;

	const generatePathFiles = async (filePath = '') => {
		const fullFilePath = workDir + filePath;
		let files;
		try {
			files = fs.readdirSync(path.join(__dirname, fullFilePath));
		}
		catch (err) {
			return console.error(`unable read files ${fullFilePath}:`, err);
		}
		for await (const file of files) {
			const fileExt = path.extname(file).substr(1);
			if (fileExt === 'js') pathJsFiles += templateJs(filePath + file);
			else if (fileExt === 'css') pathCssFiles += templateCss(filePath + file);
		}
	};

	(async () => {
		await generatePathFiles('lib/');
		await generatePathFiles();
	})();

	app.use(express.static(`${__dirname}/public/`));

	app.get('/', (req, res) => {
		let outputStr = '';
		outputStr += pathCssFiles;
		htmlFiles.forEach((htmlFile) => {
			outputStr += fs.readFileSync(`${__dirname + workDir + htmlFile}.html`);
		});
		outputStr += pathJsFiles;
		res.setHeader('Content-Type', 'text/html');
		res.send(outputStr);
	});
}
