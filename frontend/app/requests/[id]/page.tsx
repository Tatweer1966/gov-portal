'use client';
export const dynamic = 'force-dynamic';

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    type?: string;
  };
};

export default function Page({ params, searchParams }: Props) {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#103c46] mb-4">
        تفاصيل الطلب
      </h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm border">
        <p className="text-slate-700">
          رقم الطلب: <strong>{params.id}</strong>
        </p>

        {searchParams.type ? (
          <p className="mt-2 text-slate-700">
            نوع الطلب: <strong>{searchParams.type}</strong>
          </p>
        ) : null}

        <p className="mt-4 text-slate-500">
          صفحة تفاصيل الطلب قيد التجهيز.
        </p>
      </div>
    </div>
  );
}