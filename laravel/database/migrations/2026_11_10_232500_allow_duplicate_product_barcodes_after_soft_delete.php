<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique('products_user_id_barcode_unique');
        });

        DB::statement(
            'CREATE UNIQUE INDEX products_user_barcode_unique_active
             ON products (user_id, barcode) WHERE deleted_at IS NULL'
        );
    }

    public function down(): void
    {
        DB::statement('DROP INDEX products_user_barcode_unique_active');

        Schema::table('products', function (Blueprint $table) {
            $table->unique(['user_id', 'barcode']);
        });
    }
};
