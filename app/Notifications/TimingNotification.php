<?php

namespace App\Notifications;

use App\Models\Timing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\VonageMessage;
use Illuminate\Notifications\Notification;

class TimingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected Timing $timing)
    {
    }

    public function viaQueues(): array
    {
        return [
            'mail' => 'mail-queue',
            'vonage' => 'vonage-queue',
        ];
    }

    public function via(object $notifiable): array
    {
        if ($notifiable->phone) {
            return ['vonage'];
        }
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

    /**
     * Get the Vonage / SMS representation of the notification.
     */
    public function toVonage(object $notifiable): VonageMessage
    {
        return (new VonageMessage)
            ->content('You have appointment at:' . $notifiable->value);
    }



}
