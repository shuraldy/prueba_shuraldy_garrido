<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PersonajeController;
use App\Http\Controllers\API\ReporteController;

Route::middleware('api')->group(function () {
    Route::apiResource('personajes', PersonajeController::class);

    // Rutas para reportes
    Route::get('reporte/personajes-asc', [ReporteController::class, 'personajesAsc']);
    Route::get('reporte/cantidad-personajes-por-episodio', [ReporteController::class, 'cantidadPersonajesPorEpisodio']);
    Route::get('reporte/personajes-por-locacion', [ReporteController::class, 'personajesPorLocacion']);
});
