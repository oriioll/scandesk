<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('stock_histories')->update([
            'operation' => DB::raw('LOWER(operation)'),
        ]);
    }

    public function down(): void
    {
        // Irreversible a propósito: no hay forma de saber qué estaba en mayúsculas
    }
};
