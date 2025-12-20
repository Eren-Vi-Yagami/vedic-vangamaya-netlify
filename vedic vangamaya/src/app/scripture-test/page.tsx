import { VerseTemplate } from "../../modules/scripture/templates/VerseTemplate";
import { loadNormalizedGita } from "../../modules/scripture/data/loadNormalizedGita";

export default async function ScriptureTestPage() {
  let data;
  try {
    data = await loadNormalizedGita();
  } catch {
    return (
      <main>
        <h1>Scripture Test</h1>
        <p>No scripture data ingested yet.</p>
      </main>
    );
  }

  const chapterNumber = 1;
  const verseNumber = 1;
  const language = "en";
  const commentaryAuthorId = "shankara";

  return (
    <main>
      <h1>Scripture Test</h1>
      <VerseTemplate
        data={data}
        chapterNumber={chapterNumber}
        verseNumber={verseNumber}
        language={language}
        commentaryAuthorId={commentaryAuthorId}
      />
    </main>
  );
}
