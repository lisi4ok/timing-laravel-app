import * as React from "react";
import { ForwardedRef, useImperativeHandle } from "react";
import { Clock } from "lucide-react";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePeriod } from "@/components/ui/time-period";
import { Granularity, Period } from "@/components/ui/time-picker-utils";

interface TimePickerProps {
    date?: Date | null;
    onChange?: (date: Date | undefined) => void;
    hourCycle?: 12 | 24;
    granularity?: Granularity;
}

interface TimePickerRef {
    minuteRef: HTMLInputElement | null;
    hourRef: HTMLInputElement | null;
    secondRef: HTMLInputElement | null;
    periodRef?: HTMLButtonElement | null;
}

const TimePicker = React.forwardRef<TimePickerRef, TimePickerProps>(
    ({ date, onChange, hourCycle = 24, granularity = 'second' }, ref: ForwardedRef<TimePickerRef>) => {
        const minuteRef = React.useRef<HTMLInputElement>(null);
        const hourRef = React.useRef<HTMLInputElement>(null);
        const secondRef = React.useRef<HTMLInputElement>(null);
        const periodRef = React.useRef<HTMLButtonElement>(null);
        const [period, setPeriod] = React.useState<Period>(date && date.getHours() >= 12 ? 'PM' : 'AM');
        const [localDate, setLocalDate] = React.useState<Date | undefined>(date ?? undefined);

        useImperativeHandle(
            ref,
            () => ({
                minuteRef: minuteRef.current,
                hourRef: hourRef.current,
                secondRef: secondRef.current,
                periodRef: periodRef.current,
            }),
            [minuteRef, hourRef, secondRef],
        );
        return (
            <div className="flex items-center justify-center gap-2">
                <label htmlFor="datetime-picker-hour-input" className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4" />
                </label>
                <TimePickerInput
                    date={localDate}
                    setDate={setLocalDate}
                    picker={hourCycle === 24 ? 'hours' : '12hours'}
                    id="datetime-picker-hour-input"
                    ref={hourRef}
                    period={period}
                    onRightFocus={() => minuteRef?.current?.focus()}
                />
                {(granularity === 'minute' || granularity === 'second') && (
                    <>
                        :
                        <TimePickerInput
                            date={localDate}
                            setDate={setLocalDate}
                            picker="minutes"
                            ref={minuteRef}
                            onLeftFocus={() => hourRef?.current?.focus()}
                            onRightFocus={() => secondRef?.current?.focus()}
                        />
                    </>
                )}
                {granularity === 'second' && (
                    <>
                        :
                        <TimePickerInput
                            date={localDate}
                            setDate={setLocalDate}
                            picker="seconds"
                            ref={secondRef}
                            onLeftFocus={() => minuteRef?.current?.focus()}
                            onRightFocus={() => periodRef?.current?.focus()}
                        />
                    </>
                )}
                {hourCycle === 12 && (
                    <div className="grid gap-1 text-center">
                        <TimePeriod
                            period={period}
                            setPeriod={setPeriod}
                            date={localDate}
                            onDateChange={(newDate) => {
                                onChange?.(newDate);
                                if (newDate && newDate.getHours() >= 12) {
                                    setPeriod('PM');
                                } else {
                                    setPeriod('AM');
                                }
                            }}
                            ref={periodRef}
                            onLeftFocus={() => secondRef?.current?.focus()}
                        />
                    </div>
                )}
            </div>
        );
    },
);
TimePicker.displayName = 'TimePicker';

export { TimePicker };
export type { TimePickerProps, TimePickerRef };
