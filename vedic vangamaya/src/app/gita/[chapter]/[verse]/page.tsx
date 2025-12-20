import { loadNormalizedGita } from "../../../../modules/scripture/data/loadNormalizedGita";
import { VerseTemplate } from "../../../../modules/scripture/templates/VerseTemplate";

type PageProps = {
  params: {
    chapter: string;
    verse: string;
  };
};

export default async function GitaVersePage({ params }: PageProps) {
  const chapterNumber = Number(params.chapter);
  const verseNumber = Number(params.verse);

  if (!Number.isFinite(chapterNumber) || !Number.isFinite(verseNumber)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 text-white">
        <p>Invalid verse reference.</p>
      </main>
    );
  }

  let data;
  try {
    data = await loadNormalizedGita();
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 text-white">
        <p>Scripture data not available.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 text-foreground flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <VerseTemplate
          data={data}
          chapterNumber={chapterNumber}
          verseNumber={verseNumber}
          language="en"
          commentaryAuthorId="shankara"
        />
      </div>
    </main>
  );
}

