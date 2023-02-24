<?php

namespace App\Http\Controllers\Conversation;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    public function index(Request $request)
    {
        $conversations = $request->user()->conversations->load('users');

        $conversations = $conversations->map(function ($conversation) {
            $conversation->lastMessage = $conversation->messages()->orderByDesc('created_at')->first();
            return $conversation;
        });

        return response()->json([
            'conversations' => $conversations
        ], 200);
    }

    public function show(Conversation $conversation)
    {
        return response()->json([
            'conversation' => $conversation->load('users', 'messages.user')
        ], 200);
    }

    public function store(Conversation $conversation, Message $message, Request $request)
    {
        $request->validate([
            'body' => 'required'
        ]);

        $message = $conversation->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body
        ]);

        return response()->json([
            'message' => $message->load('user')
        ], 200);
    }
}
