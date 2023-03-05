<?php

namespace App\Http\Controllers\Conversation;

use App\Events\Conversation\MessageAdded;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConversationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    public function index(Request $request)
    {
        $conversations = $request->user()->conversations()->with('users')->orderBy('last_message_at', 'desc')->get();

        $conversations = $conversations->map(function ($conversation) {
            $conversation->lastMessage = $conversation->messages()->orderByDesc('created_at')->first();
            return $conversation;
        });

        return response()->json([
            'conversations' => $conversations
        ], 200);
    }

    public function show(Conversation $conversation, Request $request)
    {
        $request->user()->conversations()->updateExistingPivot($conversation, [
            'read_at' => now()
        ]);

        $conversation->load('users', 'messages.user');

        return response()->json([
            'conversation' => $conversation
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

        $conversation->update([
            'last_message_at' => now()
        ]);

        foreach ($conversation->others as $user) {
            $user->conversations()->updateExistingPivot($conversation, [
                'read_at' => null
            ]);
        }

        broadcast(new MessageAdded($message))->toOthers();

        return response()->json([
            'message' => $message->load('user')
        ], 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'users' => 'required',
            'body' => 'required'
        ]);

        $conversation = Conversation::create([
            'uuid' => Str::uuid(),
        ]);

        $conversation->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body
        ]);

        $conversation->users()->sync(collect($request->users)->merge([auth()->user()])->pluck('id')->unique());

        return response()->json($conversation, 200);
    }
}
