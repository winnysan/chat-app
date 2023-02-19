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

    public function index()
    {
        $conversations = Conversation::get();
        return response()->json([
            'conversations' => $conversations
        ], 200);
    }
}
