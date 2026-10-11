<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_add_claimed_at_to_pairing_sessions_table.php
    public function up(): void
    {
        Schema::table('pairing_sessions', function (Blueprint $table) {
            $table->timestamp('claimed_at')->nullable()->after('is_active');
            // $table->unique('token_hash');   // solo si el comando anterior no muestra un índice único
        });
    }

    public function down(): void
    {
        Schema::table('pairing_sessions', function (Blueprint $table) {
            // $table->dropUnique(['token_hash']);   // si lo añadiste arriba
            $table->dropColumn('claimed_at');
        });
    }
};
