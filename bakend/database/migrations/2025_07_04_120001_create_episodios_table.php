<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('episodios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personaje_id')->constrained('personajes')->onDelete('cascade');
            $table->string('nombre');
            $table->string('fecha_emision');
            $table->string('codigo_episodio');
            $table->string('url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('episodios');
    }
};
