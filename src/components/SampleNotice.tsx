export default function SampleNotice() {
  return (
    <p className="mb-5 inline-flex items-start gap-2 rounded-xl border border-[#c78a4d]/25 bg-[#fff9ed] px-4 py-3 text-xs leading-5 text-[#705637]">
      <span className="mt-[0.43rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c7773c]" aria-hidden="true" />
      <span><strong className="font-semibold">Preview data.</strong> These figures are placeholders, not real impact totals. Connect Supabase to show live data.</span>
    </p>
  );
}
