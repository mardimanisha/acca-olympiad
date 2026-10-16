import { Bar, Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";
import { REPORT_POINTS } from "@/lib/content";

const SCORES = [
  ["Accountancy", 82],
  ["Quant", 68],
  ["Economics", 74],
  ["Data & logic", 88],
  ["English", 61],
] as const;

const PATHWAYS = [
  ["Investment research", "CFA"],
  ["Chartered Accountant", "CA"],
  ["Corporate FP&A", "CMA"],
] as const;

const PLAN = [
  ["Next 3 months", "Join CFA & CA webinars"],
  ["6 months", "Excel & data basics"],
  ["12 months", "Shortlist degree + qualification"],
] as const;

/** s10 — sample career report. */
export function Report() {
  return (
    <Section id="s10">
      <Wrap>
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <Tile pad="none" className="p-[22px] sm:p-9">
            <span className="eyebrow">Sample career report</span>
            <h2 className="h-sub">See what your report could look like.</h2>
            <ol className="mt-6 grid gap-4">
              {REPORT_POINTS.map(([b, s], i) => (
                <li key={b} className="flex items-start gap-3.5">
                  <span className="ic size-[38px] rounded-[11px] text-[0.82rem] font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <b className="block text-navy">{b}</b>
                    <small className="text-[0.88rem]">{s}</small>
                  </div>
                </li>
              ))}
            </ol>
            <p className="note-s mt-5">
              The report supports exploration. It is not a definitive aptitude diagnosis or a guarantee of career fit.
            </p>
          </Tile>

          <Tile tone="mint" pad="none" className="flex items-center p-3.5 sm:p-[30px]">
            <div className="w-full overflow-hidden rounded-[20px] bg-white shadow-[0_30px_60px_-40px_rgba(11,26,61,.45)] transition-transform duration-500 hover:-translate-y-1">
              <div className="flex items-center justify-between bg-navy px-[22px] py-4 text-[0.8rem] text-mist">
                <div>
                  <b className="block text-base text-white">Career Discovery Report</b>
                  NCO 2027 · Sample
                </div>
                <span className="rounded-[7px] bg-teal px-2.5 py-1 font-extrabold text-white">PDF</span>
              </div>
              <div className="grid gap-3.5 p-4 sm:grid-cols-2 sm:px-[22px] sm:py-5">
                <div className="rounded-[14px] border border-line p-3.5">
                  <div className="mb-2 text-[0.64rem] font-extrabold tracking-[0.14em] text-subtle uppercase">Topic-wise performance</div>
                  {SCORES.map(([k, v], i) => (
                    <div key={k} className="mt-1.5 grid grid-cols-[78px_1fr_26px] items-center gap-2 text-[0.74rem] font-bold text-navy">
                      <span>{k}</span>
                      <Bar value={v} delay={0.15 + i * 0.1} trackClassName="bg-[#E2ECE9]" />
                      <span className="text-right text-subtle">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-[14px] border border-line p-3.5">
                  <div className="mb-2 text-[0.64rem] font-extrabold tracking-[0.14em] text-subtle uppercase">Possible pathways</div>
                  {PATHWAYS.map(([k, q]) => (
                    <div key={k} className="mt-1.5 flex justify-between rounded-lg bg-canvas px-2.5 py-[7px] text-[0.78rem] font-bold text-navy">
                      {k} <i className="text-teal not-italic">{q}</i>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2 rounded-[14px] border border-line p-3.5 sm:col-span-2 sm:grid-cols-3">
                  {PLAN.map(([k, v]) => (
                    <div key={k} className="rounded-[10px] bg-mint p-2.5 text-[0.76rem] font-semibold text-navy">
                      <b className="block text-[0.64rem] tracking-widest text-teal-deep uppercase">{k}</b>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
