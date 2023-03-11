<?php

namespace App\Http\Controllers\Api\Search;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSearchController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    public function __invoke(Request $request)
    {
        if (!$q = $request->get('q', '')) {
            return response()->json([], 200);
        }

        $user = User::where(DB::raw('LOWER(name)'), 'LIKE', '%' . Str::lower($q) . '%')->get(['id', 'name']);

        return $user->except(auth()->id());
    }
}
