<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PersonajeController;

Route::middleware('api')->group(function () {
    Route::apiResource('personajes', PersonajeController::class);
});
