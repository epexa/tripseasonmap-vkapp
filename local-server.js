const htmlFiles = [
	'header',
	'main',
	'quiz',
	'loading',
	'footer',
];

// const serverParams = { address: '127.0.0.1', port: 8081 };
const serverParams = { address: '192.168.43.254', port: 80 };

let workDir = '/src/';
if (process.env.NODE_ENV && process.env.NODE_ENV == 'dist') workDir = '/dist/';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

server.listen(serverParams.port, serverParams.address, () => {
	console.log(`Server running at http://${server.address().address}:${server.address().port} from ${workDir}`);
});

app.use(express.static(`${__dirname}/public/`));
app.use(express.static(__dirname + workDir));

const templateJs = file => { return `<script defer src="${file}"></script>`; };
const templateCss = file => { return `<link rel="stylesheet" href="${file}">`; };

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

app.get('/', (req, res) => {
	let outputStr = '';
	outputStr += pathCssFiles;
	htmlFiles.forEach(htmlFile => {
		outputStr += fs.readFileSync(`${__dirname + workDir + htmlFile}.html`);
	});
	outputStr += pathJsFiles;
	res.setHeader('Content-Type', 'text/html');
	res.send(outputStr);
});
