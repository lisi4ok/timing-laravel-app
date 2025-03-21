import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {Head, Link, router} from '@inertiajs/react';
import type { Timing } from '@/types';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Timing',
        href: '/timing',
    },
];

export default function Timing({ timings }) {
    const deleteTiming = (id: number) => {
        if (confirm('Are you sure you want to delete this timing?')) {
            router.delete(route('timing.destroy', id));
            toast("Timing deleted successfully");
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className={'mt-8'}>
                    <Link className={buttonVariants({ variant: 'outline' })} href={`/timing/create`}>
                        Create Timing
                    </Link>
                </div>
                <Table className={'mt-4'}>
                    <TableCaption>Timing List</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Egn</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timings.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.egn}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell className="text-right">{item.value}</TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={`/timing/${item.id}/edit`}
                                        className={buttonVariants({ variant: 'default' })}
                                    >
                                        Edit
                                    </Link>
                                    <Button
                                        variant={buttonVariants.danger}
                                        className={'cusor-pointer'}
                                        onClick={() => deleteTiming(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
