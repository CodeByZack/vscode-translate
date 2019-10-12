
const vscode = require('vscode');
const translate = require('./baidufanyi').translate;

const provideHover = async (document, position, token)=>{
	let editor =  vscode.window.activeTextEditor;
	let msg = getSelectText(editor);
	if(msg.length === 0) return;
	const res = await translate(msg);
	return new vscode.Hover(`${msg} : ${res}`);
}

function activate(context) {
	let disposable2 = vscode.commands.registerCommand('extension.translate',async function () {
		let editor =  vscode.window.activeTextEditor;
		let msg = getSelectText(editor);
		const res = await translate(msg);
		vscode.window.showInformationMessage(msg+ ":" +res);
	});

	// 注册鼠标悬停提示
	let disposable = vscode.languages.registerHoverProvider('javascript', {provideHover});
    context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

function deactivate() {}

const getSelectText = (editor)=>{
	let selection = editor.selection;
	let msg = editor.document.getText(selection);
	return msg;
}


exports.activate = activate;
module.exports = {
	activate,
	deactivate
}
