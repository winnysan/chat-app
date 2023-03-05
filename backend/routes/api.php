<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Search\UserSearchController;
use App\Http\Controllers\Conversation\ConversationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

Route::prefix('conversations')->group(function () {
    Route::get('/', [ConversationController::class, 'index']);
    Route::get('/{conversation:uuid}', [ConversationController::class, 'show']);
    Route::post('/{conversation:uuid}/message', [ConversationController::class, 'store']);
    Route::post('/create', [ConversationController::class, 'create']);
});

Route::get('/search/users', UserSearchController::class);

Route::middleware('auth:sanctum')->get('/test', function (Request $request) {
    return response()->json([
        'request' => 'test',
        'query' => $request->query()
    ], 200);
});
