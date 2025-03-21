import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {Transition} from "@headlessui/react";
import {Calendar as CalendarIcon, Clock} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {add, format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {toast} from "sonner";
import {TimePickerInput} from "@/components/ui/time-picker-input";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Timing',
        href: '/timings/create',
    },
];

export default function CreateTiming() {
    const name = useRef<HTMLInputElement>(null);
    const egn = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const phone = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const [date, setDate] = React.useState<Date>();

    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    const createDateTime = (
        date: Date,
        hours: number, min?: number, sec?: number, ms?: number) => {
        date.setHours(hours, min, sec, ms);

        return date;
    };

    interface CreateTimingForm {
        name: string;
        egn: number;
        email?: string;
        phone?: string;
        description?: string;
        value: string;
    }

    /**
     * carry over the current time when a user clicks a new day
     * instead of resetting to 00:00
     */
    const handleSelect = (newDay: Date | undefined) => {
        if (!newDay) return;
        if (!date) {
            setDate(newDay);
            setData('date', newDay);
            return;
        }
        const diff = newDay.getTime() - date.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        const newDateFull = add(date, { days: Math.ceil(diffInDays) });
        setDate(newDateFull);
        setData('date', newDateFull);
    };

    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm<Required<CreateTimingForm>>({
        name: '',
        egn: '',
        email: '',
        phone: '',
        description: '',
        value: '',
        date,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('timing.store'), {
            preserveScroll: true,
            onSuccess: (): void => {
                reset();
                toast.success('Successfully created timing');
            },
            onError(error) {
                console.error(error);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Timing" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="name"
                            placeholder="Name"
                        />

                        <InputError message={errors.name} />
                    </div>


                    <div className="grid gap-2">
                        <Label htmlFor="egn">EGN</Label>

                        <Input
                            id="egn"
                            ref={egn}
                            value={data.egn}
                            onChange={(e) => setData('egn', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="egn"
                            placeholder="EGN"
                        />

                        <InputError message={errors.egn} />
                    </div>


                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>


                        <Input
                            id="email"
                            ref={email}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="email"
                            placeholder="Email"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>

                        <Input
                            id="phone"
                            ref={phone}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="phone"
                            placeholder="Phone"
                        />

                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => handleSelect(d)}
                                    initialFocus
                                />
                                <div className="p-3 border-t border-border">
                                    <div className="flex items-end gap-2">
                                        <div className="grid gap-1 text-center">
                                            <Label htmlFor="hours" className="text-xs">
                                                Hours
                                            </Label>
                                            <TimePickerInput
                                                picker="hours"
                                                date={date}
                                                setDate={setDate}
                                                ref={hourRef}
                                                onRightFocus={() => minuteRef.current?.focus()}
                                            />
                                        </div>
                                        <div className="grid gap-1 text-center">
                                            <Label htmlFor="minutes" className="text-xs">
                                                Minutes
                                            </Label>
                                            <TimePickerInput
                                                picker="minutes"
                                                date={date}
                                                setDate={setDate}
                                                ref={minuteRef}
                                                onLeftFocus={() => hourRef.current?.focus()}
                                                onRightFocus={() => secondRef.current?.focus()}
                                            />
                                        </div>
                                        <div className="grid gap-1 text-center">
                                            <Label htmlFor="seconds" className="text-xs">
                                                Seconds
                                            </Label>
                                            <TimePickerInput
                                                picker="seconds"
                                                date={date}
                                                setDate={setDate}
                                                ref={secondRef}
                                                onLeftFocus={() => minuteRef.current?.focus()}
                                            />
                                        </div>
                                        <div className="flex h-10 items-center">
                                            <Clock className="ml-2 h-4 w-4"/>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.date} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}
                                onClick={(e) => setData('value', date?.toISOString())}>
                            Create timing
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
