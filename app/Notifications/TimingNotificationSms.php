<?php

namespace App\Notifications;

use App\Models\Timing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\VonageMessage;
use Illuminate\Notifications\Notification;

class TimingNotificationSms extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected Timing $timing)
    {
    }

    public function viaQueues(): array
    {
        return [
            'vonage' => 'vonage-queue',
        ];
    }

    public function via(object $notifiable): array
    {
        if ($notifiable->email) {
            return ['vonage'];
        }
        return [];
    }

    public function toVonage(object $notifiable): VonageMessage
    {
        return (new VonageMessage)
            ->content('You have appointment at:' . $notifiable->value);
    }

}
