import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration(
    "glyphwiki-preview",
  );
	const imageMaxWidth = config.get("imagePreviewMaxWidth");

	let hoverProvider = {
    provideHover(document: vscode.TextDocument, position: vscode.Position) {
      const range = document.getWordRangeAtPosition(position, /\\GWI{[^}]+}/);

      if (range === undefined) {
        return;
      }

      let word: string;
      let matchResults: string[] | null;

      word = document.getText(range);
      matchResults = word.match(/\\GWI{([^}]+)}/);

      if (!matchResults || matchResults.length < 2) {
        return;
      }

			const glyphName = matchResults[1];

      let glyphImageUrl = `https://glyphwiki.org/glyph/${glyphName}.png`;
			const glyphPageUrl = `https://glyphwiki.org/wiki/${glyphName}`;

			const maxSizeConfig = `|width=${imageMaxWidth}`;
			let contentMarkdown = ` \r\n[Open GlyphWiki Page](${glyphPageUrl})\r\n`;
			contentMarkdown += `\r\n![${glyphImageUrl}](${glyphImageUrl}${maxSizeConfig})`;

      let content = new vscode.MarkdownString(contentMarkdown);
      content.supportHtml = true;
      content.isTrusted = true;

			// content.appendText(contentMarkdown);

      return new vscode.Hover(content, new vscode.Range(position, position));
    },
  };


  context.subscriptions.push(
    vscode.languages.registerHoverProvider(["*"], hoverProvider)
  );
}

export function deactivate() {}
