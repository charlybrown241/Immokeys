<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Daily view counts per annonce (same "once per session" rule as
     * annonces.views_count), for the owner's views chart.
     */
    public function up(): void
    {
        Schema::create('annonce_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annonce_id')->constrained('annonces')->cascadeOnDelete();
            $table->date('day');
            $table->unsignedInteger('count')->default(0);

            $table->unique(['annonce_id', 'day']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonce_views');
    }
};
