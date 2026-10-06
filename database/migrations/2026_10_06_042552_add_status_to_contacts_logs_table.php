<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Owner-side follow-up of a WhatsApp contact: nouveau, traite, archive.
     */
    public function up(): void
    {
        Schema::table('contacts_logs', function (Blueprint $table) {
            $table->string('status', 20)->default('nouveau')->after('annonce_id');
        });
    }

    public function down(): void
    {
        Schema::table('contacts_logs', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
