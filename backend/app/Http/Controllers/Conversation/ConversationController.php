<?php

namespace App\Http\Controllers\Conversation;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
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

        return response()->json([
            'conversations' => $conversations
        ], 200);
    }

    public function show(Conversation $conversation, Request $request)
    {
        return response()->json([
            'conversation' => $conversation->load('users', 'messages.user')
        ], 200);
    }
}
