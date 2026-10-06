<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The original foreign keys had no ON DELETE rule, so deleting an
     * account (every user has a subscription) or an annonce that received
     * WhatsApp contacts failed. Data owned by the deleted row now goes with
     * it; a deleted student's contacts are kept, anonymised, for the
     * owners' statistics.
     */
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('certifications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['admin_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('admin_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::table('annonces', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('contacts_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['annonce_id']);
            $table->foreignId('user_id')->nullable()->change();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('annonce_id')->references('id')->on('annonces')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('contacts_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['annonce_id']);
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('annonce_id')->references('id')->on('annonces');
        });

        Schema::table('annonces', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('certifications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['admin_id']);
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('admin_id')->references('id')->on('users');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');
        });
    }
};
