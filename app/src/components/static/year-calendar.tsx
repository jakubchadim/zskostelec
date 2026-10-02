import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentAt, tiltAt } from "@/components/ui/accent";

export type CalendarEvent = { title: string; icon: LucideIcon };
export type CalendarMonth = { month: string; events: CalendarEvent[] };

/**
 * A school year as torn-off wall-calendar sheets: one per month, each with
 * its events as icon rows. A grid on desktop, a sideways-scrolling row
 * (snap per sheet) on phones; `yearRound` events go in a strip below.
 */
export function YearCalendar({
  months,
  yearRound,
}: {
  months: CalendarMonth[];
  yearRound?: CalendarEvent[];
}) {
  return (
    <div>
      <ol className="-mx-4 m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-3 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-4">
        {months.map((m, idx) => {
          const accent = accentAt(idx);
          return (
            <li
              key={m.month}
              className="w-[72%] shrink-0 snap-center xs:w-[55%] sm:w-auto"
            >
              <article
                className={cn(
                  "sticker relative flex h-full flex-col overflow-visible p-0 transition-transform hover:rotate-0",
                  tiltAt(idx),
                )}
              >
                {/* binder strip with two punched holes */}
                <div
                  className={cn(
                    "relative h-9 rounded-t-[calc(var(--radius-large)-3px)] border-b-[2.5px] border-ink",
                    accent.bg,
                  )}
                >
                  <span
                    className="absolute top-1/2 left-[28%] size-3.5 -translate-y-1/2 rounded-full border-2 border-ink bg-cream"
                    aria-hidden
                  />
                  <span
                    className="absolute top-1/2 right-[28%] size-3.5 -translate-y-1/2 rounded-full border-2 border-ink bg-cream"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 pt-3">
                  <h3
                    className={cn(
                      "font-display text-2xl leading-none font-extrabold",
                      accent.text,
                    )}
                  >
                    {m.month}
                  </h3>
                  <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
                    {m.events.map((e) => (
                      <li
                        key={e.title}
                        className="flex items-center gap-2.5 leading-tight font-semibold"
                      >
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-xl border-2 border-ink",
                            accent.tint,
                          )}
                        >
                          <e.icon
                            className={cn("size-5", accent.text)}
                            aria-hidden
                          />
                        </span>
                        {e.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {yearRound && yearRound.length > 0 && (
        <div className="mt-6 rounded-[var(--radius-large)] border-[2.5px] border-dashed border-ink/30 p-5 sm:p-6">
          <h3 className="mb-4 font-display text-xl">
            A k tomu během celého roku
          </h3>
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-3 gap-y-5 p-0">
            {yearRound.map((e, idx) => {
              const accent = accentAt(idx + 3);
              return (
                <li
                  key={e.title}
                  className="flex w-[8.5rem] flex-col items-center gap-2 text-center text-sm leading-tight font-bold"
                >
                  <span
                    className={cn(
                      "grid size-14 place-items-center rounded-full border-[2.5px] border-ink shadow-pop-sm transition-transform hover:-rotate-12 hover:scale-110",
                      accent.tint,
                    )}
                  >
                    <e.icon className={cn("size-6", accent.text)} aria-hidden />
                  </span>
                  {e.title}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
