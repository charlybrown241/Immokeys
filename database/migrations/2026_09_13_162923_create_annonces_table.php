<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('category_id')->constrained('categories');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('city', 100);
            $table->string('quartier', 100);
            $table->integer('surface')->nullable();
            $table->string('status')->default('en_attente');
            $table->integer('views_count')->default(0);
            $table->timestamps();

            $table->index(['city', 'price']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};
