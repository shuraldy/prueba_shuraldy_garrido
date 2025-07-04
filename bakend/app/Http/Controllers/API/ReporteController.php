<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Personaje;
use App\Models\Episodio;
use App\Models\Locacion;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReporteController extends Controller
{
    /**
     * Genera un reporte de personajes ordenados por la fecha de emisión de su primer episodio.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function personajesAsc()
    {
        $personajes = Personaje::with(['episodios' => function ($query) {
            // Ordenamos los episodios por fecha para poder tomar el primero fácilmente
            $query->orderBy('fecha_emision', 'asc');
        }])->get();

        $reporte = $personajes->map(function ($personaje) {
            $primerEpisodio = $personaje->episodios->first();

            if ($primerEpisodio && $primerEpisodio->fecha_emision) {
                try {
                    $fechaEmision = Carbon::parse($primerEpisodio->fecha_emision);
                    $diasAntiguedad = $fechaEmision->diffInDays(Carbon::now());

                    return [
                        'nombre_personaje' => $personaje->nombre,
                        'primer_episodio_nombre' => $primerEpisodio->nombre,
                        'primer_episodio_fecha_emision' => $fechaEmision->toDateString(),
                        'dias_antiguedad' => $diasAntiguedad,
                    ];
                } catch (\Exception $e) {
                    // Maneja fechas con formato inválido, si las hubiera.
                }
            }

            // Fallback por si un personaje no tiene episodios o fechas válidas
            return [
                'nombre_personaje' => $personaje->nombre,
                'primer_episodio_nombre' => 'N/A',
                'primer_episodio_fecha_emision' => 'N/A',
                'dias_antiguedad' => 0,
            ];
        });

        // Ordenar el reporte final por la fecha de emisión
        $reporteOrdenado = $reporte->sortBy(function ($item) {
            return $item['primer_episodio_fecha_emision'] === 'N/A' 
                ? PHP_INT_MAX 
                : Carbon::parse($item['primer_episodio_fecha_emision'])->timestamp;
        })->values();

        return response()->json($reporteOrdenado);
    }

    /**
     * Genera un reporte con la cantidad de personajes por episodio.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function cantidadPersonajesPorEpisodio()
    {
        $reporte = Episodio::query()
            ->select('nombre as episodio', DB::raw('count(*) as cantidad_personajes'))
            ->groupBy('nombre')
            ->orderBy('episodio')
            ->get();

        return response()->json($reporte);
    }

    /**
     * Genera un reporte de personajes agrupados por locación.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function personajesPorLocacion()
    {
        // Eager load 'personaje' para optimizar y solo tomar locaciones que tengan un personaje.
        $locaciones = Locacion::with('personaje')->whereHas('personaje')->get();

        $reporte = $locaciones
            ->groupBy('nombre')
            ->map(function ($locacionesEnMismoLugar, $nombreLocacion) {
                // Mapeamos para obtener solo los nombres de los personajes.
                $personajes = $locacionesEnMismoLugar->map(function ($locacion) {
                    return $locacion->personaje->nombre;
                });

                return [
                    'locacion' => $nombreLocacion,
                    'personajes' => $personajes->all(),
                ];
            })
            ->sortBy('locacion') // Ordenamos alfabéticamente por nombre de locación.
            ->values(); // Reseteamos las llaves para tener un array limpio.

        return response()->json($reporte);
    }
}
