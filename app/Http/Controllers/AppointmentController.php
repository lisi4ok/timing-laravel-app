<?php

namespace App\Http\Controllers;

use App\Dto\Timing as Dto;
use App\Http\Requests\StoreTimingRequest;
use App\Notifications\TimingNotification;
use App\Notifications\TimingNotificationEmail;
use App\Notifications\TimingNotificationSms;
use App\Services\Timing;

class AppointmentController extends Controller
{
    public function __construct(protected Timing $timing)
    {
    }

    public function __invoke(StoreTimingRequest $request)
    {
        $dto = Dto::fromArray($request->validated());
        $timing = $this->timing->create($dto);

        $notification = $request->input('notify_me');


        if ($request->input('notify_me')) {
            if ($request->input('phone')) {
                $timing->notify(new TimingNotificationSms($timing));
            }
            if ($request->input('email')) {
                $timing->notify(new TimingNotificationEmail($timing));
            }
            $timing->notify(new TimingNotification($timing));
        }

        return redirect()->route('home')
            ->with('success', 'Thanks for appointment.');

    }
}
