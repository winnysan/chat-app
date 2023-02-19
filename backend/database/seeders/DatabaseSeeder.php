<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::factory()->create([
            'name' => 'Marek',
            'email' => 'm@r.ek'
        ]);

        User::factory()->create([
            'name' => 'Peter',
            'email' => 'p@t.er'
        ]);

        User::factory()->create([
            'name' => 'Stano',
            'email' => 's@s.es'
        ]);

        Conversation::factory(5)->create();
    }
}
