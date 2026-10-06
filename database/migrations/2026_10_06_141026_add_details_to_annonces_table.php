<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Optional listing details: rooms, furnished, availability date,
     * monthly charges, deposit and amenities (keys of Annonce::AMENITIES).
     */
    public function up(): void
    {
        Schema::table('annonces', function (Blueprint $table) {
            $table->unsignedTinyInteger('rooms')->nullable()->after('surface');
            $table->boolean('is_furnished')->nullable()->after('rooms');
            $table->date('available_from')->nullable()->after('is_furnished');
            $table->decimal('charges', 10, 2)->nullable()->after('price');
            $table->decimal('deposit', 10, 2)->nullable()->after('charges');
            $table->json('amenities')->nullable()->after('available_from');
        });
    }

    public function down(): void
    {
        Schema::table('annonces', function (Blueprint $table) {
            $table->dropColumn(['rooms', 'is_furnished', 'available_from', 'charges', 'deposit', 'amenities']);
        });
    }
};
