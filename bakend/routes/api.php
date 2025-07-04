<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PersonajeController;
use App\Http\Controllers\API\ReporteController;
use App\Http\Controllers\API\ReporteadorController;

Route::middleware('api')->group(function () {
    Route::apiResource('personajes', PersonajeController::class);

    // Rutas para reportes
    Route::get('reporte/personajes-asc', [ReporteController::class, 'personajesAsc']);
    Route::get('reporte/cantidad-personajes-por-episodio', [ReporteController::class, 'cantidadPersonajesPorEpisodio']);
    Route::get('reporte/personajes-por-locacion', [ReporteController::class, 'personajesPorLocacion']);

    // Rutas para obtener las opciones de los filtros
    Route::get('reporte/opciones/locaciones', [ReporteController::class, 'getOpcionesLocaciones']);
    Route::get('reporte/opciones/personajes', [ReporteController::class, 'getOpcionesPersonajes']);
    Route::get('reporte/opciones/episodios', [ReporteController::class, 'getOpcionesEpisodios']);
    Route::get('reporte/opciones/estados', [ReporteController::class, 'getOpcionesEstados']);

    // Ruta para el reporteador avanzado y dinámico
    Route::get('reporte/generar', [ReporteadorController::class, 'generar']);
});
