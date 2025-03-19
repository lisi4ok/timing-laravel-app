import { type SharedData, type NavItem } from '@/types';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar as CalendarIcon, Clock} from "lucide-react";
import {add, format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {TimePickerInput} from "@/components/ui/time-picker-input";
import {Transition} from "@headlessui/react";
import React, {FormEventHandler, useRef} from "react";
import {toast} from "sonner";
import {Checkbox} from "@/components/ui/checkbox";

const mainNavItems: NavItem[] = [
    {
        title: 'Timing',
        href: '/timing',
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export default function Welcome() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

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

    interface MakeApointmentForm {
        name: string;
        egn: number;
        email?: string;
        phone?: string;
        description?: string;
        notify_me?: boolean;
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

    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm<Required<MakeApointmentForm>>({
        name: '',
        egn: '',
        email: '',
        phone: '',
        description: '',
        value: '',
        notify_me: false,
        date,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('appointment'), {
            preserveScroll: true,
            onSuccess: (): void => {
                reset();
                toast.success('Successfully created An appointment');
            },
            onError(error) {
                console.error(error);
            }
        });
    };


    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <NavigationMenu className="flex h-full items-stretch">
                        <NavigationMenuList className="flex h-full items-stretch space-x-2">
                            {mainNavItems.map((item, index) => (
                                <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            page.url === item.href && activeItemStyles,
                                            'h-9 cursor-pointer px-3',
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                    {page.url === item.href && (
                                        <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
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

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Notify Me</Label>

                                    <Checkbox
                                        onCheckedChange={(checked) => {
                                            if (checked === false) {
                                                setData('notify_me', false)
                                                return true
                                            } else {
                                                setData('notify_me', true)
                                                return false
                                            }
                                        }}
                                        />

                                    <InputError message={errors.phone} />
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
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
