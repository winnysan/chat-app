<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    public function show(User $user, Conversation $conversation)
    {
        return $user->inConversation($conversation->uuid);
    }
}
