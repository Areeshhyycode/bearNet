import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SCHEDULED_EXAM } from "@/lib/mock-data";

/** Certification countdown widget. */
export function ExamCountdown() {
  const cells = [
    { value: SCHEDULED_EXAM.daysLeft, label: "Days", accent: false },
    { value: SCHEDULED_EXAM.hoursLeft, label: "Hours", accent: false },
    { value: `${SCHEDULED_EXAM.prepared}%`, label: "Prepared", accent: true },
  ];

  return (
    <div className="flex flex-col justify-between gap-space-md rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-lg lg:col-span-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
            Scheduled Exam
          </span>
          <Badge tone="lavender">{SCHEDULED_EXAM.daysLeft} Days Left</Badge>
        </div>
        <h3 className="font-headline-md text-[18px] font-bold text-on-surface">
          {SCHEDULED_EXAM.title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Recommended study pace: {SCHEDULED_EXAM.pace}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="flex-1 rounded-xl bg-surface-container-low p-2 text-center"
          >
            <div
              className={`font-headline-md text-headline-md font-bold ${
                cell.accent ? "text-tertiary" : "text-on-surface"
              }`}
            >
              {cell.value}
            </div>
            <div className="font-label-badge text-label-badge text-on-surface-variant">
              {cell.label}
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" block>
        Review Schedule Calendar
      </Button>
    </div>
  );
}
