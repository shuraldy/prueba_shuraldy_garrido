<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('personajes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('estado');
            $table->string('especie');
            $table->string('tipo')->nullable();
            $table->string('genero');
            $table->string('imagen');
            $table->string('url');
            $table->string('creado');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personajes');
    }
};
