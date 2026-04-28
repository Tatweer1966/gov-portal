export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const res = await fetch(
    `http://localhost:3000/api/directus/news/${params.slug}`,
    { cache: 'no-store' }
  );

  const json = await res.json();

  if (!json.success || !json.data) {
    return <div className="p-10 text-center">الخبر غير موجود</div>;
  }

  const item = json.data;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{item.title_ar}</h1>
      <p className="text-gray-600 mb-6">{item.summary_ar}</p>
      <div>{item.content_ar}</div>
    </div>
  );
}