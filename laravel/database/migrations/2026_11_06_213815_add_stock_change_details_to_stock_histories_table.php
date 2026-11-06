<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_histories', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('operation')->nullable();
            $table->integer('old_value')->nullable();
            $table->integer('new_value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_histories', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn(['product_id', 'operation', 'old_value', 'new_value']);
        });
    }
};
