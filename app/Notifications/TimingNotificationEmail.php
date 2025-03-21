<?php

namespace App\Notifications;

use App\Models\Timing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TimingNotificationEmail extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected Timing $timing)
    {
    }

    public function viaQueues(): array
    {
        return [
            'mail' => 'mail-queue',
        ];
    }

    public function via(object $notifiable): array
    {
        if ($notifiable->email) {
            return ['mail'];
        }
        return [];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('You have appointment at:' . $notifiable->value);
    }

}
